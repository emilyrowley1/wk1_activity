const pool = require("../database");

async function getInboxMessagesByAccountId(account_id) {
    try {
      const data = await pool.query(
        "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = FALSE",
        [account_id]
      )
      return data.rows
    } catch (error) {
      console.error("getmessagesbyaccountid error " + error)
    }
}

async function getUnreadMessagesByAccountId(account_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = FALSE AND message_read = FALSE",
      [account_id]
    )
    return data.rows.length
  } catch (error) {
    console.error("Get Unread Messages By Account Id error " + error)
  }
}

async function getArchivedMessagesByAccountId(account_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.message WHERE message_to = $1 AND message_archived = TRUE",
      [account_id]
    )

    return data.rows
  } catch (error) {
    console.error("getmessagesbyaccountid error " + error)
  }
}

async function getName(account_id) {
    try {
      const data = await pool.query(
        "SELECT account_firstname, account_lastname FROM public.account WHERE account_id = $1",
        [account_id]
      )

      return data.rows[0]
    } catch (error) {
      console.error("getmessagesbyaccountid error " + error)
    }
}

async function getMessageDetailsById(message_id) {
    try {
      const data = await pool.query(
        "SELECT * FROM public.message WHERE message_id = $1",
        [message_id]
      )

      return data.rows
    } catch (error) {
      console.error("getmessagesbyaccountid error " + error)
    }
}

async function archiveMessageById(message_id) {
    try {
      const data = await pool.query(
        "UPDATE message SET message_archived = 'TRUE' WHERE message_id = $1",
        [message_id]
      )

      return data.rows
    } catch (error) {
      console.error("Archive Message By ID error " + error)
    }
}

async function markAsReadById(message_id) {
  try {
    const data = await pool.query(
      "UPDATE message SET message_read = 'TRUE' WHERE message_id = $1",
      [message_id]
    )

    return data.rows
  } catch (error) {
    console.error("Mark As Read By ID error " + error)
  }
}

async function deleteMessageById(message_id) {
  try {
    const data = await pool.query(
      "DELETE FROM message WHERE message_id = $1",
      [message_id]
    )

    return data.rows
  } catch (error) {
    console.error("Delete Message By ID error " + error)
  }
}

/* ***************************
 *  Get all user data
 * ************************** */
async function getUsers(){
  return await pool.query("SELECT * FROM public.account ORDER BY account_firstname")
}

async function addNewMessage(message_subject, message_body, message_created, message_to, message_from){
  try {
    
    const sql = "INSERT INTO message (message_subject, message_body, message_created, message_to, message_from) VALUES ($1, $2, $3, $4, $5) RETURNING *"

    return await pool.query(sql, [message_subject, message_body, message_created, message_to, message_from])
  } catch (error) {
    return error.message
  }
}

module.exports = {getInboxMessagesByAccountId, getArchivedMessagesByAccountId, getName, getMessageDetailsById, archiveMessageById, markAsReadById, deleteMessageById, getUsers, addNewMessage, getUnreadMessagesByAccountId}