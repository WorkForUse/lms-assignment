import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchRandomProducts, fetchRandomUsers } from "../../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCourses = async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        fetchRandomUsers(),
        fetchRandomProducts(),
      ]);

      const users = usersResponse.data || [];
      const products = productsResponse.data || [];

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
      Alert.alert("Error", "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [courses, searchQuery]);

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity style={styles.courseCard}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription}>{item.description}</Text>
      <Text style={styles.courseInstructor}>Instructor: {item.instructor}</Text>
      <Text style={styles.coursePrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search courses..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  listContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  courseInstructor: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
});
