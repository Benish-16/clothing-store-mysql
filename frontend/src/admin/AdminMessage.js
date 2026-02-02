import React, { useEffect, useState } from "react";

export default function AdminMessage() {
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
    const token = localStorage.getItem("token");
 useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/contact/admin/messages?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data.messages);


      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  fetchMessages();
}, [page]); 


 const sendReply = async (id) => {
  const reply = replyText[id];

  if (!reply || reply.trim() === "") return;

  try {
    const res = await fetch(`http://localhost:5000/api/contact/admin/messages/reply/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },
      body: JSON.stringify({ reply }),
    });

    const data = await res.json();

    if (data.success) {
   
      setReplyText(prev => ({ ...prev, [id]: "" }));

     
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id
            ? { ...msg, replies: [...(msg.replies || []), { message: reply }] }
            : msg
        )
      );
    } else {
      alert("Failed to send reply");
    }
  } catch (err) {
    console.error("Error sending reply:", err);
    alert("Something went wrong while sending the reply");
  }
};


  return (
         <main className="main ">
    <div>
     
      <h2 className="mb-4">Contact Messages</h2>

      {messages.map((msg) => (

        <div key={msg.id} className="card mb-3">
            
          <div className="card-body">
            <h5>{msg.fullname} ({msg.email})</h5>
            <p>{msg.message}</p>
            <small>Status: {msg.status}</small>

     
            {msg.replies && msg.replies.length > 0 ? (
              msg.replies.map((r, i) => (
                <div key={i} className="alert alert-secondary mt-2">
                  <strong>Admin:</strong> {r.message}
                </div>
              ))
            ) : (
              <>
                <p className="text-muted mt-3">
                  <strong>Reply to them</strong>
                </p>

                <textarea
                  className="form-control"
                  placeholder="Type your reply..."
                  value={replyText[msg.id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [msg.id]: e.target.value,
                  
                      
                    })
                  }
                />

                <button
  className="btn btn-dark mt-2"
  onClick={() => sendReply(msg.id)}
  disabled={!replyText[msg.id] || replyText[msg.id].trim() === ""}
>
  Reply
</button>

              </>
            )}
          </div>
        </div>
      ))}

    </div>
      <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
  <button
    className="btn btn-outline-dark"
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
  >
    &laquo; Previous
  </button>

  <span className="fw-bold">
    Page {page} of {totalPages}
  </span>

  <button
    className="btn btn-outline-dark"
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
  >
    Next &raquo;
  </button>
</div>
    </main>
  );
}
