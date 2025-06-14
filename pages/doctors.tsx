import { useState } from "react";
import {
  User,
  Search,
  Calendar,
  Stethoscope,
  Clock,
  MessageSquare,
  ChevronRight,
  Moon,
  Sun,
  BarChart2,
  Heart,
  LogOut,
} from "lucide-react";

// Mock Data
const patients = [
  { id: 1, name: "Alice Johnson", age: 34, condition: "Hypertension", nextAppt: "Tomorrow, 10:00 AM" },
  { id: 2, name: "John Smith", age: 47, condition: "Type 2 Diabetes", nextAppt: "Today, 3:00 PM" },
  { id: 3, name: "Maria Lee", age: 29, condition: "Asthma", nextAppt: "Friday, 9:30 AM" },
  { id: 4, name: "Samuel Ade", age: 51, condition: "High Cholesterol", nextAppt: "Next Mon, 11:15 AM" },
];

const appointments = [
  { id: 1, patient: "John Smith", time: "3:00 PM", type: "Follow-up", location: "Room 203" },
  { id: 2, patient: "Alice Johnson", time: "10:00 AM", type: "Consultation", location: "Room 202" },
  { id: 3, patient: "Maria Lee", time: "9:30 AM", type: "Routine Check", location: "Room 203" },
];

export default function DoctorsPage() {
  const [isDark, setIsDark] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-200 dark:from-slate-900 dark:via-blue-900 dark:to-blue-800 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-blue-100 dark:border-blue-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900 dark:text-white">Doctor Dashboard</h1>
                <p className="text-sm text-blue-500 dark:text-blue-200">Welcome, Dr. Jane Doe</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark((d) => !d)}
                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? <Sun className="w-5 h-5 text-blue-600" /> : <Moon className="w-5 h-5 text-blue-600" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors">
                <LogOut className="w-5 h-5 text-blue-600 dark:text-blue-200" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Patients List */}
          <section className="md:col-span-2 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-blue-900 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-5 h-5 text-blue-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="flex-1 p-2 rounded-lg border border-blue-100 dark:border-blue-700 bg-white/70 dark:bg-slate-800/60 text-blue-900 dark:text-blue-100 focus:outline-none"
              />
            </div>
            <h2 className="text-lg font-bold text-blue-800 dark:text-white mb-3">My Patients</h2>
            <ul className="space-y-4 flex-1 overflow-y-auto">
              {filteredPatients.map(p => (
                <li
                  key={p.id}
                  className={`rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${
                    selectedPatient?.id === p.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-900 dark:text-white"
                  }`}
                  onClick={() => setSelectedPatient(p)}
                >
                  <div>
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-sm">{p.condition}</p>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </li>
              ))}
            </ul>
          </section>

          {/* Main Content */}
          <section className="md:col-span-3 flex flex-col gap-8">
            {/* Today's Appointments */}
            <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-4 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                  Today’s Appointments
                </h3>
              </div>
              <div className="space-y-4">
                {appointments.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-white">{appt.patient}</p>
                        <p className="text-sm text-blue-500 dark:text-blue-200">{appt.type} • {appt.location}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-2 text-blue-700 dark:text-blue-200 font-bold">
                      <Clock className="w-4 h-4" />
                      {appt.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Quick View / Doctor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quick Patient View */}
              <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
                <h4 className="text-lg font-bold text-blue-900 dark:text-white mb-3">
                  {selectedPatient ? `Patient: ${selectedPatient.name}` : "Select a patient"}
                </h4>
                {selectedPatient ? (
                  <div>
                    <p className="mb-2">
                      <span className="text-blue-600 font-semibold">Age:</span>{" "}
                      {selectedPatient.age}
                    </p>
                    <p className="mb-2">
                      <span className="text-blue-600 font-semibold">Condition:</span>{" "}
                      {selectedPatient.condition}
                    </p>
                    <p>
                      <span className="text-blue-600 font-semibold">Next Appointment:</span>{" "}
                      {selectedPatient.nextAppt}
                    </p>
                    <button className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                      <MessageSquare className="inline w-4 h-4 mr-2" />
                      Message Patient
                    </button>
                  </div>
                ) : (
                  <p className="text-blue-500">Choose a patient to view details</p>
                )}
              </div>

              {/* Doctor Stats */}
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-800">
                <h4 className="text-lg font-bold text-blue-900 dark:text-white mb-3">Your Stats</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <BarChart2 className="w-5 h-5" />
                    <span>Patients: 36</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Calendar className="w-5 h-5" />
                    <span>Appointments today: 5</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Heart className="w-5 h-5" />
                    <span>Avg. Patient Rating: 4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
