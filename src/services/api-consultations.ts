import axios from 'axios'

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

  async getProjects() {
    const data = JSON.stringify({
      query: `{
      projects(first: 5, orderBy: {field: PUBLISHED_AT, direction: DESC}) {
        totalCount
        edges {
          node {
            id
            title
            publishedAt
          }
        }
      }
    }`,
      variables: {},
    })

    const response = await this.sendRequest(data)
    return response.data
  }

  async getProjectDetail(projectId: string) {
    const data = JSON.stringify({
      query: `{
    node(id: "${projectId}") {
       ... on Project {
                    id
                    title
                    url
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
      variables: {},
    })

    const response = await this.sendRequest(data)
    return response.data
  }

  async getSampleProjectDetail() {
    const response = await this.getProjects()
    const sampleProjectID = response.projects.edges[0].node.id
    const projectDetail = await this.getProjectDetail(sampleProjectID)
    try {
      const projectJSON = this.parseProjectDetail(projectDetail.node)
      return projectJSON
    } catch (error) {
      console.log(error)
      return null
    }
  }

  parseProjectDetail(project: any) {
    let state = 'open'
    if (project.steps.every((s: { state: string }) => s.state == 'CLOSED')) {
      state = 'closed'
    }

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

    return {
      id: project.id,
      img: project.cover?.url,
      title: project.title,
      status: state,
      date_end: date_end,
      location: 'Non renseigné',
      content: 'Non renseigné',
      nb_comments: project.contributions.totalCount,
      nb_likes: project.votes.totalCount,
      nb_persons: project.contributors.totalCount,
      url: project.url,
    }
  }
}

// function getThemeId (): string | undefined {
//     return process.env.FABRIQUE_CITOYENNE_THEME_ID
// }

export const apiConsultationService = new ApiConsultationService()
