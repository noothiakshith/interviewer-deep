import { prisma } from '../db'
import {app} from './graph'

const initialstate = {
    userid:{
        id:'7c15b344-f2a2-4c76-9e74-5efda8f8c1f4'
    },
    questions:[],
    currentQuestionIndex:0,
    answers:[],
    evaluation:null
}
const response = app.invoke(initialstate)

