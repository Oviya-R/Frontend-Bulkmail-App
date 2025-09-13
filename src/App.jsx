import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emailList.map((item) => item.A);
      setemailList(totalemail);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true);
    axios
      .post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(() => {
        alert("✅ Email sent successfully!");
        setstatus(false);
        setmsg("");
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("❌ Error in sending email");
      });
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex flex-col items-center justify-center p-6">

      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-2 animate-bounce">BulkMail ✉️</h1>
        <p className="text-white text-lg">One platform to send many emails quickly, easily, efficiently.</p>
      </header>

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 border-t-4 border-purple-500">
        <div className="mb-6">
          <label className="block text-purple-600 font-semibold mb-2">Email Content ✍️</label>
          <textarea
            onChange={handlemsg}
            value={msg}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none shadow-sm"
            placeholder="Write your email content here..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-purple-600 font-semibold mb-2">Upload Excel File 📂</label>
          <input
            onChange={handlefile}
            type="file"
            className="w-full border-2 border-dashed border-purple-300 p-4 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition shadow-sm"
          />
          <p className="mt-2 text-gray-500">Total emails detected: <span className="font-bold text-purple-600">{emailList.length}</span></p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={send}
            disabled={status}
            className="bg-pink-600 text-white py-3 px-10 rounded-full font-bold shadow-lg hover:bg-purple-700 hover:scale-105 transition transform"
          >
            {status ? "⏳ Sending..." : "🚀 Send Emails"}
          </button>
        </div>
      </div>

      <footer className="mt-8 text-white text-sm">
        &copy; {new Date().getFullYear()} BulkMail • Designed for you 🌟
      </footer>
    </div>
  );
}

export default App;
