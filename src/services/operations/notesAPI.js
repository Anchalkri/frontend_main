import { toast } from "react-hot-toast"
import { apiConnector } from "../../services/apiconnector"
import { notesEndpoints } from "../apis"

const {
  CREATE_NOTES_API,
  GET_MY_NOTES_API,
  GET_A_NOTE__API,
  UPDATE_NOTE_API,
  DELETE_NOTE_API,
  SHARE_NOTE_API,
  GET_ALL_NOTES_API,
  REQUEST_ACCESS_API,
  APPROVE_ACCESS_API
} = notesEndpoints

// 📌 Create Note
export async function createNotes({ title, content, courseId, isPublic }) {
  try {
    const response = await apiConnector("POST", CREATE_NOTES_API, {
      title,
      content,
      courseId,
      isPublic
    })
    toast.success("Note created successfully")
    return response.data
  } catch (err) {
    toast.error(err?.response?.data?.error || "Failed to create note")
    return null
  }
}

// 📌 Get All Notes by Me
export async function getMyNotes() {
  try {
    const response = await apiConnector("GET", GET_MY_NOTES_API)
    return response.data
  } catch (err) {
    toast.error("Failed to fetch your notes")
    return null
  }
}

// 📌 Get Single Note by ID
export async function getSingleNote(noteId) {
  try {
    const response = await apiConnector("GET", `${GET_A_NOTE__API}/${noteId}`)
    return response.data
  } catch (err) {
    toast.error("Failed to fetch note")
    return null
  }
}

// 📌 Update Note
export async function updateNote(noteId, { title, content, isPublic }) {
  try {
    const response = await apiConnector("PUT", `${UPDATE_NOTE_API}/${noteId}`, {
      title,
      content,
      isPublic
    })
    toast.success("Note updated")
    return response.data
  } catch (err) {
    toast.error("Failed to update note")
    return null
  }
}

// 📌 Delete Note
export async function deleteNote(noteId) {
  try {
    const response = await apiConnector("DELETE", `${DELETE_NOTE_API}/${noteId}`)
    toast.success("Note deleted")
    return response.data
  } catch (err) {
    toast.error("Failed to delete note")
    return null
  }
}

// 📌 Share Note
export async function shareNote(noteId, { userId, role }) {
  try {
    const response = await apiConnector("POST", `${SHARE_NOTE_API}/${noteId}`, {
      userId,
      role
    })
    toast.success("Note shared")
    return response.data
  } catch (err) {
    toast.error("Failed to share note")
    return null
  }
}

// 📌 Get All Public Notes
export async function getAllNotes() {
  try {
    const response = await apiConnector("GET", GET_ALL_NOTES_API)
    return response.data
  } catch (err) {
    toast.error("Failed to fetch public notes")
    return null
  }
}

// 📌 Request Access to Note
export async function requestAccess(noteId) {
  try {
    const response = await apiConnector("POST", `${REQUEST_ACCESS_API}/${noteId}`)
    toast.success("Access requested")
    return response.data
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to request access")
    return null
  }
}

// 📌 Approve Access Request
export async function approveAccess(noteId, { userId, role }) {
  try {
    const response = await apiConnector("POST", `${APPROVE_ACCESS_API}/${noteId}`, {
      userId,
      role
    })
    toast.success("Access approved")
    return response.data
  } catch (err) {
    toast.error("Failed to approve access")
    return null
  }
}