import { useEffect, useState } from "react";
import {
  MessageSquare, Calendar, User, Heart, Bell, Shield,
  Phone, Video, Send, FileText, Clock, Activity, Pill,
  AlertCircle, CheckCircle, Camera, Paperclip, Settings, LogOut,
  Home, Stethoscope, TrendingUp, Plus, Search, Filter,
  Upload, Download, Edit, Check, X, ChevronRight, ChevronLeft,
  BookOpen, Clipboard, Target, Zap, Moon, Sun
} from "lucide-react";

export default function PatientsPage() {
  // ----- STATE MANAGEMENT -----
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessage, setChatMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  
  const [messages, setMessages] = useState([
    {
      id: 1, sender: 'doctor', message: 'Good morning Alice! How are you feeling today?', 
      time: '9:30 AM', read: true, avatar: '/api/placeholder/32/32'
    },
    {
      id: 2, sender: 'patient', message: 'Hi Dr. Doe, I\'ve been experiencing some chest tightness since yesterday.', 
      time: '2:30 PM', read: true, avatar: null
    },
    {
      id: 3, sender: 'doctor', message: 'Thank you for reaching out. Can you describe the intensity on a scale of 1-10? Any shortness of breath?', 
      time: '2:32 PM', read: true, avatar: '/api/placeholder/32/32'
    },
    {
      id: 4, sender: 'patient', message: 'I\'d say it\'s about a 6/10. No shortness of breath, but I noticed some irregular heartbeats.', 
      time: '2:35 PM', read: true, avatar: null
    },
    {
      id: 5, sender: 'doctor', message: 'I understand your concern. Let\'s schedule a check-up for tomorrow. Please avoid strenuous activities and monitor your symptoms closely.', 
      time: '2:40 PM', read: false, avatar: '/api/placeholder/32/32'
    }
  ]);

  const [medications, setMedications] = useState([
    { 
      id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", 
      nextDose: "Tomorrow 8:00 AM", remaining: 15, taken: false, 
      instructions: "Take with food", sideEffects: "Dizziness, dry cough"
    },
    { 
      id: 2, name: "Metformin", dosage: "500mg", frequency: "Twice daily", 
      nextDose: "In 4 hours", remaining: 8, taken: true,
      instructions: "Take with meals", sideEffects: "Nausea, stomach upset"
    },
    { 
      id: 3, name: "Vitamin D3", dosage: "1000IU", frequency: "Once daily", 
      nextDose: "Tomorrow 8:00 AM", remaining: 30, taken: false,
      instructions: "Take with fat-containing meal", sideEffects: "Rare if taken as directed"
    }
  ]);

  const patientInfo = {
    name: "Alice Johnson",
    age: 34,
    condition: "Hypertension, Type 2 Diabetes",
    doctor: "Dr. Jane Doe",
    nextAppointment: "Tomorrow, 10:00 AM",
    lastVisit: "Last week",
    memberSince: "2022",
    emergencyContact: "+1 (555) 123-4567",
    bloodType: "O+",
    allergies: "Penicillin, Shellfish"
  };

  const appointments = [
    {
      id: 1, date: "2025-06-10", time: "10:00 AM", type: "Follow-up Consultation", 
      doctor: "Dr. Jane Doe", status: "Confirmed", location: "Room 203",
      duration: "30 min", notes: "Blood pressure check"
    },
    {
      id: 2, date: "2025-06-13", time: "2:30 PM", type: "Routine Check-up", 
      doctor: "Dr. Jane Doe", status: "Scheduled", location: "Room 203",
      duration: "45 min", notes: "Complete physical examination"
    },
    {
      id: 3, date: "2025-06-20", time: "11:00 AM", type: "Lab Results Review", 
      doctor: "Dr. Jane Doe", status: "Pending", location: "Room 203",
      duration: "20 min", notes: "Discuss recent blood work"
    }
  ];

  const vitals = [
    { label: "Blood Pressure", value: "125/80", status: "normal", icon: Heart, trend: "stable", lastUpdated: "Yesterday" },
    { label: "Heart Rate", value: "72 bpm", status: "normal", icon: Activity, trend: "stable", lastUpdated: "Yesterday" },
    { label: "Weight", value: "68 kg", status: "stable", icon: TrendingUp, trend: "down", lastUpdated: "3 days ago" },
    { label: "Blood Sugar", value: "95 mg/dL", status: "normal", icon: Target, trend: "stable", lastUpdated: "Today" }
  ];

  const upcomingTasks = [
    { id: 1, task: "Take morning medications", time: "8:00 AM", completed: false, type: "medication" },
    { id: 2, task: "Blood pressure check", time: "10:00 AM", completed: true, type: "vital" },
    { id: 3, task: "Doctor appointment", time: "10:00 AM Tomorrow", completed: false, type: "appointment" },
    { id: 4, task: "Lab work", time: "Next week", completed: false, type: "test" }
  ];

  // ----- FUNCTIONS -----
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'patient',
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
        avatar: null
      };
      setMessages([...messages, newMessage]);
      setChatMessage('');

      setTimeout(() => {
        const doctorResponse = {
          id: messages.length + 2,
          sender: 'doctor',
          message: 'Thank you for the update. I\'ll review this information and get back to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          avatar: '/api/placeholder/32/32'
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const markMedicationTaken = (id: number) => {
  setMedications(prev => prev.map(med =>
    med.id === id ? { ...med, taken: !med.taken } : med
  ));
};

  const bookAppointment = () => {
    if (selectedDate && selectedTime && appointmentType) {
      const newAppointment = {
        id: appointments.length + 1,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        doctor: "Dr. Jane Doe",
        status: "Pending",
        location: "TBD",
        duration: "30 min",
        notes: "New appointment request"
      };
      // In real app, this would make an API call
      setShowAppointmentModal(false);
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('');
    }
  };

  const getStatusColor = (
  status: "normal" | "stable" | "warning" | string
) => {
  switch (status) {
    case "normal":
      return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
    case "stable":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    case "warning":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
  }
};


  const getAppointmentStatusColor = (
  status: "Confirmed" | "Scheduled" | "Pending" | "Cancelled" | string
) => {
    switch (status) {
      case "Confirmed":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Scheduled":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "Pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Cancelled":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

    // ----- RENDER FUNCTIONS -----
    const renderOverview = () => (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Appointment</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Tomorrow</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">10:00 AM</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400"/>
              </div>
            </div>

            <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Medications</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">3 Active</p>
                  <p className="text-sm text-green-600 dark:text-green-400">1 taken today</p>
                </div>
                <Pill className="w-8 h-8 text-green-600 dark:text-green-400"/>
              </div>
            </div>

            <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">2</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">From Dr. Doe</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400"/>
              </div>
            </div>

            <div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Health Score</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">85/100</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Good</p>
                </div>
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400"/>
              </div>
            </div>
          </div>

          {/* Recent Vitals */}
          <div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vitals.map((vital, index) => {
                const IconComponent = vital.icon;
                return (
                    <div key={index}
                         className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vital.status)}`}>
                    {vital.status}
                  </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{vital.label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{vital.value}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{vital.lastUpdated}</p>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                  <div key={task.id}
                       className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div
                          className={`w-4 h-4 rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                        {task.completed && <Check className="w-3 h-3 text-white"/>}
                      </div>
                      <div>
                        <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.task}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{task.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.type === 'medication' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            task.type === 'appointment' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                task.type === 'vital' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                    'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                {task.type}
              </span>
                  </div>
              ))}
            </div>
          </div>
        </div>
    );

    const renderChat = () => (
        <div
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Dr. Jane Doe</h3>
                <p className="text-sm text-green-500 dark:text-green-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div key={message.id}
                     className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div
                      className={`flex gap-2 max-w-[70%] ${message.sender === 'patient' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {message.sender === 'doctor' && (
                        <div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white"/>
                        </div>
                    )}
                    <div className={`p-3 rounded-2xl ${
                        message.sender === 'patient'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                          message.sender === 'patient'
                              ? 'text-blue-200'
                              : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
              <div className="flex-1 relative">
                <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4 text-white"/>
                </button>
              </div>
            </div>
          </div>
        </div>
    );

    const renderAppointments = () => (
        <div className="space-y-6">
          {/* Header with Book Appointment Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h2>
            <button
                onClick={() => setShowAppointmentModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Plus className="w-4 h-4"/>
              Book Appointment
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {appointments.map((appointment) => (
                <div key={appointment.id}
                     className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.type}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">with {appointment.doctor}</p>
                      </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date & Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{appointment.date} at {appointment.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{appointment.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">{appointment.duration}</p>
                    </div>
                  </div>

                  {appointment.notes && (
                      <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.notes}</p>
                      </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      Reschedule
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Book Appointment Modal */}
          {showAppointmentModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book New Appointment</h3>
                    <button
                        onClick={() => setShowAppointmentModal(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appointment Type
                      </label>
                      <select
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select type...</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Check-up">Check-up</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Date
                      </label>
                      <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Time
                      </label>
                      <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select time...</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={bookAppointment}
                        className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Book Appointment
                    </button>
                    <button
                        onClick={() => setShowAppointmentModal(false)}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
    );

    const renderMedications = () => (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medications</h2>
            <div className="flex items-center gap-2">
              <button
                  className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <Plus className="w-4 h-4"/>
              </button>
            </div>
          </div>

          {/* Medications List */}
          <div className="space-y-4">
            {medications.map((medication) => (
                <div key={medication.id}
                     className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                        <Pill className="w-6 h-6 text-green-600 dark:text-green-400"/>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{medication.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{medication.dosage} - {medication.frequency}</p>
                      </div>
                    </div>
                    <button
                        onClick={() => markMedicationTaken(medication.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            medication.taken
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        }`}
                    >
                      {medication.taken ? <CheckCircle className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                      {medication.taken ? 'Taken' : 'Mark Taken'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Next Dose</p>
                      <p className="font-medium text-gray-900 dark:text-white">{medication.nextDose}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Remaining</p>
                      <p className="font-medium text-gray-900 dark:text-white">{medication.remaining} pills</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Refill Status</p>
                      <p className={`font-medium ${
                          medication.remaining < 10
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-green-600 dark:text-green-400'
                      }`}>
                        {medication.remaining < 10 ? 'Low Stock' : 'Good'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Instructions:</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{medication.instructions}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Side Effects:</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">{medication.sideEffects}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      Request Refill
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>

          {/* Personal Information */}
          <div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Age</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.age} years old</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Blood Type</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.bloodType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Emergency
                  Contact</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.emergencyContact}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Medical
                  Conditions</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.condition}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Allergies</label>
                <p className="text-gray-900 dark:text-white font-medium">{patientInfo.allergies}</p>
              </div>
            </div>
          </div>

          {/* Healthcare Team */}
          <div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Healthcare Team</h3>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
              <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white"/>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{patientInfo.doctor}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Primary Care Physician</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
            </div>
          </div>
        </div>
    );

    // ----- MAIN RENDER -----
    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode
                ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
                : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'
        }`}>
          {/* Header */}
          <div
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 shadow-lg">
                    <User className="w-8 h-8 text-white"/>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HealthConnect</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back, {patientInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300"/> :
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>}
                  </button>
                  <button
                      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 mb-8 overflow-x-auto">
              {[
                {id: 'overview', label: 'Overview', icon: Home},
                {id: 'chat', label: 'Messages', icon: MessageSquare},
                {id: 'appointments', label: 'Appointments', icon: Calendar},
                {id: 'medications', label: 'Medications', icon: Pill},
                {id: 'profile', label: 'Profile', icon: User}
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/60 dark:bg-slate-800/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                        }`}
                    >
                      <IconComponent className="w-4 h-4"/>
                      {tab.label}
                    </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'chat' && renderChat()}
              {activeTab === 'appointments' && renderAppointments()}
              {activeTab === 'medications' && renderMedications()}
              {activeTab === 'profile' && renderProfile()}
            </div>
          </div>
        </div>
    );
  }