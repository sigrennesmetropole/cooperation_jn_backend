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
    return projectDetail
  }
}

// function getThemeId (): string | undefined {
//     return process.env.FABRIQUE_CITOYENNE_THEME_ID
// }

function cleanGraphQlData(response: any) {
  const data = response.data.data.node

  let state = 'open'
  if (data.steps.every((s: { state: string }) => s.state == 'CLOSED')) {
    state = 'closed'
  }

  const arrayDate: string[] = data.steps
    .filter((s: { timeRange: any | undefined }) => s.timeRange !== undefined)
    .map(
      (s: { timeRange: { endAt: string } }) => s.timeRange.endAt.split(' ')[0]
    )

  const sortedDates = arrayDate.sort((a, b) => {
    const dateA: number = Date.parse(a)
    const dateB: number = Date.parse(b)

    return dateB - dateA
  })
  const displaySortedDates = sortedDates[0].split('-')
  const date_end =
    displaySortedDates[2] +
    '/' +
    displaySortedDates[1] +
    '/' +
    displaySortedDates[0]

  return {
    id: data.id,
    img: data.cover.url,
    title: data.title,
    status: state,
    date_end: date_end,
    location: 'Non renseigné',
    content: 'Non renseigné',
    nb_comments: data.contributions.totalCount,
    nb_likes: data.votes.totalCount,
    nb_persons: data.contributors.totalCount,
    url: data.url,
  }
}

// Api call to get the projects from the theme id

// async function getProjectsBasicInformations(themeId: string | undefined) {
//     const data = `
//       {
//         projects(theme: ${themeId}) {
//           totalCount
//           edges {
//             node {
//               id
//               title
//               url
//               }
//             }
//           }
//         }
//       }
//       `

//   const url = `${getProjectUrl()}`
//   const config = {
//     method: 'post' as Method,
//     url,
//     headers: {
//       'Content-Type': 'application/graphql',
//       'Accept': 'application/vnd.cap-collectif.preview+json'
//     },
//     data
//   }
//   try {
//     const response = await axios(config)
//     return response.data.data
//   } catch (error) {
//     return []
//   }
// }

// async function getProjectFullInformations(projectId: string) {
//   const data = `
//         {
//             node(id: "${projectId}") {
//                 ... on Project {
//                     id
//                     title
//                     url
//                     contributors {
//                         totalCount
//                     }
//                     votes {
//                         totalCount
//                     }
//                     contributions {
//                         totalCount
//                     }
//                     cover {
//                         url
//                     }
//                     steps {
//                         __typename
//                         ... on QuestionnaireStep {
//                           id
//                           title
//                           state
//                           timeRange {
//                             endAt
//                           }
//                         }
//                         ... on SelectionStep {
//                           id
//                           title
//                           state
//                           timeRange {
//                             endAt
//                           }
//                         }
//                         ... on CollectStep {
//                           id
//                           title
//                           state
//                           timeRange {
//                             endAt
//                           }
//                         }
//                         ... on PresentationStep {
//                           id
//                           title
//                           state
//                         }
//                         ... on ConsultationStep {
//                           id
//                           title
//                           state
//                           timeRange {
//                             endAt
//                           }
//                         }
//                         ... on OtherStep {
//                           id
//                           title
//                           state
//                         }
//                     }
//                 }
//             }
//         }
//         `

//   const url = `${getProjectsUrl()}`
//   console.log(`url: ${url}`)
//   console.log(`project id: ${projectId}`)
//   const config = {
//     method: 'post' as Method,
//     url,
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/vnd.cap-collectif.preview+json',
//     },
//     data,
//   }
//   try {
//     const response = await axios(config)
//     const cleanData = cleanGraphQlData(response)
//     return cleanData
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }

// export async function getConsultationInformations() {
//   const projectsInformations: any[] = []

//   // const projectsBasicInformations: any[] = await getProjectsBasicInformations(getThemeId())

//   // This is a simulation of results given by the first api call on CapCollectif url. Do not remove for now.
//   // const projectsBasicInformations: any[] = [{
//   //     id:'UHJvamVjdDo2ZGZjMzc3Mi05MDBhLTExZWQtODBlMC0wMjQyYWMxMTAwMDk=',
//   //     title:'Concertation guidée TRAMBUS',
//   //     url:'https://demo3.cap-collectif.com/project/concertation-guidee-trambus/questionnaire/contribution-requalification-de-la-rue-chicogne'
//   // },{
//   //     id:'UHJvamVjdDowNmYwNmZmYS05MGNmLTExZWQtODBlMC0wMjQyYWMxMTAwMDk=',
//   //     title:'Boite à idées TRAMBUS',
//   //     url:'https://demo3.cap-collectif.com/project/boite-a-idees-trambus/presentation/le-trambus-quest-ce-que-cest'
//   // }]

//   // This is a simulation of results given by the first api call on FabriqueCitoyenne url. Do not remove for now.
//   const projectsBasicInformations: any[] = [
//     {
//       id: 'UHJvamVjdDpiYjIwMWFlNy0zNmJiLTExZWUtYTM3MC0wMjQyYWMxMTAwMDQ=',
//       title: 'Trambus',
//       url: 'https://fabriquecitoyenne.fr/project/trambus/presentation/presentation',
//     },
//   ]

//   if (projectsBasicInformations.length >= 0) {
//     for (const project of projectsBasicInformations) {
//       const projectInformation = await getProjectFullInformations(project.id)
//       console.log(projectInformation)
//       if (projectInformation) {
//         projectsInformations.push(projectInformation)
//       } else {
//         projectsInformations.push(project)
//       }
//     }
//   }
//   return projectsInformations
// }

export const apiConsultationService = new ApiConsultationService()
