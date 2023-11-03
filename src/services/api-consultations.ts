import axios from 'axios'

interface ProjectJSON {
  id: string
  img: string
  title: string
  meta_description: string
  status: string
  date_end: string | null
  location: string
  geojson: string
  content: string
  nb_comments: number
  nb_likes: number
  nb_persons: number
  url: string
}

function getProjectsUrl(): string | undefined {
  return process.env.FABRIQUE_CITOYENNE_URL
}

class ApiConsultationService {
  async sendRequest(data: string): Promise<any> {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: getProjectsUrl(),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.cap-collectif.preview+json',
      },
      data: data,
    }

    const response = await axios(config)
    return response.data
  }

  async getProjects(theme: string, count = 10) {
    const data = JSON.stringify({
      query: `{
        projects (first: 1000 orderBy: {field: PUBLISHED_AT, direction: DESC}) {
          totalCount
          edges {
            node {
              id
              title
              publishedAt
              themes {
                  title
              }
            }
          }
        }
      }`,
      variables: {},
    })
    const projects: ProjectJSON[] = []

    const response = await this.sendRequest(data)
    // Filter based on the theme
    for (const e of response.data.projects.edges) {
      if (projects.length >= count) {
        break
      }
      const themes = e.node.themes.map((theme: any) => theme.title)
      if (!themes.includes(theme)) {
        continue
      }
      try {
        const projectDetail = await this.getProjectDetail(e.node.id)
        const projectJSON = this.parseProjectDetail(projectDetail.node)
        projects.push(projectJSON)
      } catch (error) {
        console.log(`Failed to retrieve project ${e.node.id}`)
        console.log(error)
      }
    }
    console.log(`Total projects: ${response.data.projects.totalCount}`)
    console.log(`Retrieved projects: ${projects.length}`)
    return projects
  }

  async getProjectDetail(projectId: string) {
    const data = JSON.stringify({
      query: `query ($nodeID: ID!){
        node(id: $nodeID) {
           ... on Project {
                        id
                        title
                        url
                        metaDescription
                        districts{
                          edges {
                              node {
                                  id
                                  name
                                  description
                                  geojson
                              }
                          }
                      }
                      themes {
                          __typename
                          ... on Theme {
                              title
                          }
                      }
                        contributors {
                            totalCount
                        }
                        votes {
                            totalCount
                        }
                        contributions {
                            totalCount
                        }
                        cover {
                            url
                        }
                        steps {
                            __typename
                            ... on QuestionnaireStep {
                              id
                              title
                              state
                              timeRange {
                                endAt
                              }
                            }
                            ... on SelectionStep {
                              id
                              title
                              state
                              timeRange {
                                endAt
                              }
                            }
                            ... on CollectStep {
                              id
                              title
                              state
                              timeRange {
                                endAt
                              }
                            }
                            ... on PresentationStep {
                              id
                              title
                              state
                            }
                            ... on ConsultationStep {
                              id
                              title
                              state
                              timeRange {
                                endAt
                              }
                            }
                            ... on OtherStep {
                              id
                              title
                              state
                            }
                        }
                    }
                }
            }`,
      variables: {
        nodeID: projectId,
      },
    })

    const response = await this.sendRequest(data)
    return response.data
  }

  parseProjectDetail(project: any): ProjectJSON {
    // State
    let state = 'open'
    if (
      project.steps
        .filter(
          (s: { __typename: string }) => s.__typename != 'PresentationStep'
        )
        .every((s: { state: string }) => s.state == 'CLOSED')
    ) {
      state = 'closed'
    }

    // End Date
    const arrayDate: string[] = project.steps
      .filter((s: { timeRange: any | undefined }) => s.timeRange !== undefined)
      .map((s: { timeRange: { endAt: string } }) =>
        s.timeRange.endAt ? s.timeRange.endAt.split(' ')[0] : null
      )

    const sortedDates = arrayDate.sort((a, b) => {
      const dateA: number = Date.parse(a)
      const dateB: number = Date.parse(b)

      return dateB - dateA
    })
    let date_end = null
    if (sortedDates[0]) {
      const displaySortedDates = sortedDates[0].split('-')
      date_end =
        displaySortedDates[2] +
        '/' +
        displaySortedDates[1] +
        '/' +
        displaySortedDates[0]
    }

    // Location
    let location = null
    let geojson = null
    if (project.districts) {
      location = project.districts.edges[0].node.name
      try {
        geojson = project.districts.edges[0].node.geojson
        if (geojson) {
          geojson = JSON.parse(geojson)
        }
      } catch (error) {
        console.log(
          `Error parsing location for ID ${project.id}:  ${project.districts.edges[0].node.geojson}`
        )
      }
    }

    // Themes
    let content = null
    if (project.themes.length > 0) {
      content = project.themes[0].title
    }

    return {
      id: project.id,
      img: project.cover?.url,
      title: project.title,
      meta_description: project.metaDescription,
      status: state,
      date_end: date_end,
      location: location,
      geojson: geojson,
      content: content,
      nb_comments: project.contributions.totalCount,
      nb_likes: project.votes.totalCount,
      nb_persons: project.contributors.totalCount,
      url: project.url,
    }
  }
}

export const apiConsultationService = new ApiConsultationService()
