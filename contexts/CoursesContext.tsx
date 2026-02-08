import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchRandomProducts, fetchRandomUsers } from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  bookmarked?: boolean;
}

interface CoursesContextType {
  courses: Course[];
  bookmarkedCourses: Course[];
  isLoading: boolean;
  refreshCourses: () => Promise<void>;
  toggleBookmark: (courseId: string) => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
};

interface CoursesProviderProps {
  children: ReactNode;
}

export const CoursesProvider: React.FC<CoursesProviderProps> = ({
  children,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        fetchRandomUsers(),
        fetchRandomProducts(),
      ]);

      const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      const products = Array.isArray(productsResponse.data)
        ? productsResponse.data
        : [];

      const courseData: Course[] = [
        ...users.map((user: any, index: number) => ({
          id: `user-${index}`,
          title: `Course by ${user.name}`,
          description: `Learn from ${user.name}, a professional instructor.`,
          instructor: user.name,
          price: Math.floor(Math.random() * 100) + 10,
        })),
        ...products.map((product: any, index: number) => ({
          id: `product-${index}`,
          title: product.title,
          description: product.description,
          instructor: "Expert Instructor",
          price: product.price,
        })),
      ];

      setCourses(courseData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      if (bookmarks) {
        setBookmarkedCourses(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  };

  const saveBookmarks = async (bookmarks: Course[]) => {
    try {
      await AsyncStorage.setItem(
        "bookmarkedCourses",
        JSON.stringify(bookmarks),
      );
    } catch (error) {
      console.error("Failed to save bookmarks:", error);
    }
  };

  const toggleBookmark = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const isBookmarked = bookmarkedCourses.some((c) => c.id === courseId);
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarkedCourses.filter((c) => c.id !== courseId);
    } else {
      newBookmarks = [...bookmarkedCourses, course];
    }

    setBookmarkedCourses(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const refreshCourses = async () => {
    setIsLoading(true);
    await loadCourses();
  };

  useEffect(() => {
    loadCourses();
    loadBookmarks();
  }, []);

  const value: CoursesContextType = {
    courses,
    bookmarkedCourses,
    isLoading,
    refreshCourses,
    toggleBookmark,
  };

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
};
