import axios, { type Method } from 'axios'

function getProjectId (): string | undefined {
  return process.env.CAP_COLLECTIF_PROJECT_ID
}

export async function getConsultationInformations () {
  // const data = {
  //     query: `
  //     {
  //         node(id: "${getProjectId()}") {
  //             ... on Project {
  //                 id
  //                 title
  //                 publishedAt
  //                 steps {
  //                     __typename
  //                     ... on QuestionnaireStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     }
  //                     ... on SelectionStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     }
  //                     ... on CollectStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     }
  //                     ... on PresentationStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     }
  //                     ... on ConsultationStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     timeRange {
  //                         endAt
  //                         startAt
  //                     }
  //                     contributors {
  //                         totalCount
  //                     }
  //                     }
  //                     ... on OtherStep {
  //                     id
  //                     title
  //                     state
  //                     url
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     `
  // }

  const data = `{
        node(id: "UHJvamVjdDo2ZGZjMzc3Mi05MDBhLTExZWQtODBlMC0wMjQyYWMxMTAwMDk=") {
          ... on Project {
            id
            title
            publishedAt
          }
        }
      }`

  const url = 'https://demo3.cap-collectif.com/graphql'
  const config = {
    method: 'post' as Method,
    url,
    headers: {
      'Content-Type': 'application/graphql'
      // Authorization: `Bearer xxx`
    },
    data
  }
  try {
    const response = await axios(config)
    const data2 = response.data
    return data2
  } catch (error) {
    // @ts-expect-error
    throw new Error('Error during get consultations: ' + error.message)
  }
}
