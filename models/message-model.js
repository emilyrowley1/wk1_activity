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

async function getOutboxMessagesByAccountId(account_id) {
    try {
      const data = await pool.query(
        "SELECT * FROM public.message WHERE message_from = $1",
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

async function markAsReadByIdById(message_id) {
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

module.exports = {getInboxMessagesByAccountId, getOutboxMessagesByAccountId, getName, getMessageDetailsById, archiveMessageById}