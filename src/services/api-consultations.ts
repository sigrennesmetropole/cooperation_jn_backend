import axios from 'axios'

interface ProjectJSON {
  id: string
  img: string
  title: string
  status: string
  date_end: string | null
  location: string
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

    const projects: ProjectJSON[] = []

    const response = await this.sendRequest(data)
    for (const e of response.data.projects.edges) {
      const projectDetail = await this.getProjectDetail(e.node.id)
      const projectJSON = this.parseProjectDetail(projectDetail.node)
      projects.push(projectJSON)
    }

    return projects
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

  parseProjectDetail(project: any): ProjectJSON {
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
