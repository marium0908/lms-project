import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Course, Lecture } from '../types';
import { getEmbedUrl } from '../utils/videoHelper';
import { ArrowLeft, Play, Loader2, AlertCircle } from 'lucide-react';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.data.course);
        const fetchedLectures: Lecture[] = res.data.data.lectures;
        setLectures(fetchedLectures);
        if (fetchedLectures.length > 0) {
          setActiveLecture(fetchedLectures[0]);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Course not found (404). It may have been removed.');
        } else {
          setError('Failed to load course details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
        <p className="text-red-700 font-medium">{error || 'Course not found'}</p>
        <Link to="/" className="inline-block mt-4 text-indigo-600 hover:underline font-medium">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to All Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="text-slate-600 mt-2 max-w-3xl">{course.description}</p>
          </div>
          <div className="shrink-0">
            <span className="inline-block bg-indigo-50 text-indigo-700 font-bold text-xl px-4 py-2 rounded-lg border border-indigo-100">
              {course.price === 0 ? 'Free' : `৳${course.price}`}
            </span>
          </div>
        </div>
      </div>

      {/* Video Player & Lecture List */}
      {lectures.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          No lectures have been added to this course yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Embedded Video Player */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {activeLecture && (
              <>
                <div className="aspect-video bg-black">
                  <iframe
                    src={getEmbedUrl(activeLecture.videoUrl)}
                    title={activeLecture.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900">{activeLecture.title}</h2>
                  <p className="text-slate-600 mt-2">{activeLecture.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Right: Course Lectures List */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 h-fit shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg px-2 pb-3 border-b border-slate-100">
              Course Content ({lectures.length} Lectures)
            </h3>
            <div className="mt-3 space-y-2">
              {lectures.map((lecture, idx) => {
                const isSelected = activeLecture?._id === lecture._id;
                return (
                  <button
                    key={lecture._id}
                    onClick={() => setActiveLecture(lecture)}
                    className={`w-full text-left p-3 rounded-lg border transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Play
                      className={`w-4 h-4 mt-1 shrink-0 ${
                        isSelected ? 'text-indigo-600 fill-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {idx + 1}. {lecture.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{lecture.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
