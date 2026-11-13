import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Course, Lecture } from '../types';
import { Plus, Pencil, Trash2, Video, X } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    thumbnailUrl: '',
  });

  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturesForCourse = async (course: Course) => {
    setSelectedCourse(course);
    setEditingLectureId(null);
    setLectureForm({ title: '', description: '', videoUrl: '' });
    try {
      const res = await api.get(`/courses/${course._id}`);
      setLectures(res.data.data.lectures);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...courseForm, price: Number(courseForm.price) };
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      setCourseForm({ title: '', description: '', price: '', thumbnailUrl: '' });
      setEditingCourseId(null);
      fetchCourses();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Error saving course');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: String(course.price),
      thumbnailUrl: course.thumbnailUrl,
    });
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Delete this course and all its lectures?')) return;
    try {
      await api.delete(`/courses/${id}`);
      if (selectedCourse?._id === id) {
        setSelectedCourse(null);
        setLectures([]);
      }
      fetchCourses();
    } catch {
      alert('Failed to delete course');
    }
  };

  const handleLectureSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      if (editingLectureId) {
        await api.put(`/lectures/${editingLectureId}`, lectureForm);
      } else {
        await api.post(`/courses/${selectedCourse._id}/lectures`, lectureForm);
      }
      setLectureForm({ title: '', description: '', videoUrl: '' });
      setEditingLectureId(null);
      fetchLecturesForCourse(selectedCourse);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Error saving lecture');
    }
  };

  const handleEditLecture = (lecture: Lecture) => {
    setEditingLectureId(lecture._id);
    setLectureForm({
      title: lecture.title,
      description: lecture.description,
      videoUrl: lecture.videoUrl,
    });
  };

  const handleDeleteLecture = async (id: string) => {
    if (!window.confirm('Delete this lecture?') || !selectedCourse) return;
    try {
      await api.delete(`/lectures/${id}`);
      fetchLecturesForCourse(selectedCourse);
    } catch {
      alert('Failed to delete lecture');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCourseId ? 'Edit Course' : 'Add New Course'}
              </h2>
              {editingCourseId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourseId(null);
                    setCourseForm({ title: '', description: '', price: '', thumbnailUrl: '' });
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Course Title"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Price (BDT)"
                  required
                  min="0"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <input
                type="url"
                placeholder="Thumbnail Image URL (https://...)"
                required
                value={courseForm.thumbnailUrl}
                onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <textarea
                placeholder="Course Description"
                required
                rows={2}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {editingCourseId ? 'Update Course' : 'Create Course'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-900">
              All Courses ({courses.length})
            </div>
            {loading ? (
              <p className="p-6 text-slate-500 text-sm">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="p-6 text-slate-500 text-sm">No courses found. Create one above.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      selectedCourse?._id === course._id ? 'bg-indigo-50/60' : ''
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Price: BDT {course.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fetchLecturesForCourse(course)}
                        className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Lectures
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditCourse(course)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 cursor-pointer"
                        title="Edit Course"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            {!selectedCourse ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Click <strong>Lectures</strong> on any course from the left list to add, edit, or delete its lectures.
              </div>
            ) : (
              <div>
                <div className="mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs uppercase font-semibold text-indigo-600">Managing Lectures For</span>
                  <h2 className="text-lg font-bold text-slate-900">{selectedCourse.title}</h2>
                </div>

                <form onSubmit={handleLectureSubmit} className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Lecture Title"
                    required
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input
                    type="url"
                    placeholder="Video URL (YouTube or Embed Link)"
                    required
                    value={lectureForm.videoUrl}
                    onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <textarea
                    placeholder="Lecture Description"
                    required
                    rows={2}
                    value={lectureForm.description}
                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {editingLectureId ? 'Update Lecture' : 'Add Lecture'}
                    </button>
                    {editingLectureId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLectureId(null);
                          setLectureForm({ title: '', description: '', videoUrl: '' });
                        }}
                        className="text-sm text-slate-500 px-3 py-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <h3 className="text-sm font-bold text-slate-700 mb-2">Lectures ({lectures.length})</h3>
                {lectures.length === 0 ? (
                  <p className="text-xs text-slate-500">No lectures yet for this course.</p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {lectures.map((lec, index) => (
                      <div
                        key={lec._id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {index + 1}. {lec.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">{lec.description}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditLecture(lec)}
                            className="p-1 text-slate-500 hover:text-amber-600 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLecture(lec._id)}
                            className="p-1 text-slate-500 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
