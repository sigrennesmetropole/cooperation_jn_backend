import axios, { type Method } from 'axios'

function getProjectId (): string | undefined {
  return process.env.CAP_COLLECTIF_PROJECT_ID
}

function getProjectUrl (): string | undefined {
    return process.env.CAP_COLLECTIF_PROJECT_URL
  }

export async function getConsultationInformations () {
// récupération de la données sur un projet à patir de son id
    const data =
        `
        {
            node(id: "${getProjectId()}") {
                ... on Project {
                    id
                    title
                    publishedAt
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
                        state
                        __typename
                    }
                }
            }
        }
        `

    // récupération sur tous les projets => chercher comment regrouper les projets de TramBus
    // const data = `
    //   {
    //     projects(first: 24, orderBy: {field: PUBLISHED_AT, direction: DESC}) {
    //       totalCount
    //       edges {
    //         node {
    //           id
    //           title
    //           publishedAt
    //           url
    //           contributors {
    //             totalCount
    //           }
    //           votes {
    //             totalCount
    //           }
    //           contributions {
    //             totalCount
    //           }
    //           cover {
    //             url
    //           }
    //           steps {
    //             state
    //             timeRange {
    //               endAt
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   `
  const url = `${getProjectUrl()}`
  const config = {
    method: 'post' as Method,
    url,
    headers: {
      'Content-Type': 'application/graphql',
      'Accept': 'application/vnd.cap-collectif.preview+json'
      // Authorization: `Bearer xxx`
    },
    data
  }
  try {
    const response = await axios(config)
    const cleanData = cleanGraphQlData(response)
    return cleanData
  } catch (error) {
    // @ts-expect-error
    throw new Error('Error during get consultations: ' + error.message)
  }
}

function cleanGraphQlData(response: any) {
    const data = response.data.data.node

    // Statut du projet en focntion du statut de ses steps A REVOIR
    let state = "inAnalysis"
    if(data.steps.every((s: { state: string }) => s.state == "CLOSED")) {
        state = "closed"
    }
    else if(data.steps.every((s: { state: string }) => s.state == "OPENED")) {
        state = "open"
    }

    return [{
        id: data.id,
        img: data.cover.url,
        title: data.title,
        status: state,
        date_end: "01/01/2001",
        location: "fix me",
        content: "no content",
        nb_comments: data.contributions.totalCount,
        nb_likes: data.votes.totalCount,
        nb_persons: data.contributors.totalCount,
        link: data.url
    }]
}