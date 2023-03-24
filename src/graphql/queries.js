import { gql } from "@apollo/client";

export const FETCH_TODOS = gql`
    query getTodos {
        todos {
            done
            id
            text
        }
    }`

export const CREATE_TODO = gql`
    mutation CreateTodo($text: String!) {
        insert_todos(objects: {done: false, text: $text}) {
            returning {
                done
                id
                text
            }
        }
    }
`

export const DELETE_TODO = gql`
    mutation DeleteTodo($id: uuid!) {
        delete_todos(where: {id: {_eq: $id}}) {
            returning {
                done
                id
                text
            }
        }
    }
`
export const TOGGLE_TODO = gql`
        mutation UpdateTodo($id: uuid!, $done: Boolean) {
            update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
                returning {
                    text
                    id
                    done
                }
            }
        }
`