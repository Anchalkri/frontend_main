import React, { useEffect, useState } from "react"
import { RxCross2 } from "react-icons/rx"
import {
  getMyNotes,
  getAllNotes,
  deleteNote,
  shareNote,
  updateNote
} from "../../../services/operations/notesAPI" // Adjust path as needed
import { toast } from "react-hot-toast"

export default function NotesModal({ setNotesModal }) {
  const [activeTab, setActiveTab] = useState("myNotes")
  const [myNotes, setMyNotes] = useState([])
  const [publicNotes, setPublicNotes] = useState([])
  const [editNote, setEditNote] = useState(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (activeTab === "myNotes") {
          const res = await getMyNotes()
          setMyNotes(res || [])
        } else {
          const res = await getAllNotes()
          setPublicNotes(res || [])
        }
      } catch (err) {
        toast.error("Failed to fetch notes")
      }
    }
    fetchNotes()
  }, [activeTab])

  const handleDelete = async (id) => {
    await deleteNote(id)
    // Refresh notes
    setMyNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const handleShare = async (id) => {
    const userId = prompt("Enter userId to share with:")
    const role = prompt("Enter role (read/edit):")
    if (userId && role) {
      await shareNote(id, { userId, role })
    }
  }

  const handleEdit = (note) => {
    setEditNote(note)
  }

  const handleSaveEdit = async () => {
    if (!editNote?.id) return
    await updateNote(editNote.id, {
      title: editNote.title,
      content: editNote.content,
      isPublic: editNote.isPublic || false
    })
    setEditNote(null)
    // Refresh notes
    const res = await getMyNotes()
    setMyNotes(res.notes || [])
  }

  const notesToShow = activeTab === "myNotes" ? myNotes : publicNotes

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Notes</p>
          <button onClick={() => setNotesModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-around border-b border-richblack-600 bg-richblack-900">
          <button
            className={`w-full py-3 text-sm font-medium ${
              activeTab === "myNotes" ? "bg-richblack-800 text-yellow-50" : "text-richblack-200"
            }`}
            onClick={() => setActiveTab("myNotes")}
          >
            My Notes
          </button>
          <button
            className={`w-full py-3 text-sm font-medium ${
              activeTab === "publicNotes" ? "bg-richblack-800 text-yellow-50" : "text-richblack-200"
            }`}
            onClick={() => setActiveTab("publicNotes")}
          >
            Public Notes
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {notesToShow.length === 0 ? (
            <p className="text-center text-richblack-300">No notes found.</p>
          ) : (
            notesToShow.map((note) => (
              <div
                key={note.id}
                className="flex justify-between items-center border border-richblack-600 rounded-md px-4 py-3 bg-richblack-700"
              >
                <p className="text-richblack-5">{note.title}</p>
                <div className="flex gap-2">
                  <button className="text-sm text-yellow-50 hover:underline" onClick={() => handleEdit(note)}>
                    Edit
                  </button>
                  <button className="text-sm text-yellow-50 hover:underline" onClick={() => handleShare(note.id)}>
                    Share
                  </button>
                  <button className="text-sm text-pink-200 hover:underline" onClick={() => handleDelete(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Section */}
        {editNote && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <input
                className="w-full p-2 rounded bg-richblack-600 text-white"
                value={editNote.title}
                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
              />
              <textarea
                className="w-full p-2 rounded bg-richblack-600 text-white"
                rows={4}
                value={editNote.content}
                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditNote(null)} className="text-sm text-richblack-300">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="text-sm text-yellow-50">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}