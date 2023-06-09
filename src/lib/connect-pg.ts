import { Pool } from 'pg'

import { Profile } from '../models/Profile'

const pool = new Pool()

export const saveUser = (user: Profile) => {
    try {
    //     const query = {
    //         text: `
    //             INSERT INTO personalBreakdown (
    //                 userId,
    //                 firstName,
    //                 lastName,
    //                 email,
    //                 password,
    //                 accountType,
    //                 dateCreated,
    //                 dateLastUpdated
    //             ) VALUES (
    //                 $1, $2, $3, $4, $5, $6, $7, $8
    //             );
    //         `,
    //         values: [
    //             newUser.userId,
    //             newUser.name,
    //             '',
    //             newUser.email,
    //             newUser.password,
    //             newUser.accountType,
    //             newUser.dateCreated,
    //             newUser.dateLastUpdated
    //         ]
    //     }

    //     const queryResult = await pool.query(query)

    //     if(queryResult.rowCount < 1 && !queryResult.rowCount) {
    //         return null
    //     }

    //     return newUser
    } catch(error) {
        console.log(error)
        
        return null
    }
}