import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Course } from '../types';
import { PlayCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data);
      } catch (err) {
        setError('Failed to load courses. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
        <p className="text-slate-600 mt-1">Browse our industrial software engineering courses and start learning.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-48 object-cover bg-slate-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co';
                }}
              />
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-slate-900 line-clamp-1">{course.title}</h2>
                <p className="text-slate-600 text-sm mt-2 line-clamp-2 flex-1">{course.description}</p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-bold text-indigo-600">
                    {course.price === 0 ? 'Free' : `৳${course.price}`}
                  </span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <PlayCircle className="w-4 h-4" />
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
