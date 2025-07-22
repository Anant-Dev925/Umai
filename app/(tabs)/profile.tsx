import { account, getCurrentUser } from "@/lib/appwrite";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/auth.store";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getCurrentUser();
        setUser(userInfo);
      } catch (error) {
        console.error("❌ Failed to load user:", error);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setIsAuthenticated(false);
    } catch (error: any) {
      // Only log error if it's not about being already logged out
      console.warn("Logout issue:", error?.message);
    } finally {
      router.replace("/(auth)/sign-in"); // Always redirect to sign-in
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="black" />
        </Pressable>
        <Text className="text-lg ">Profile</Text>
        <Feather name="search" size={18} color="black" />
      </View>

      {/* Avatar */}
      <View className="items-center mt-2 mb-5">
        <View className="relative">
          <Image
            source={
              user.avatarUrl
                ? { uri: user.avatarUrl }
                : require("@/assets/images/avatar.png")
            }
            className="profile-avatar"
          />
          <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-gray-300">
            <Feather name="edit" size={16} color="#F59E0B" />
          </View>
        </View>
      </View>

      {/* Profile Card */}
      <View className="bg-white rounded-2xl mt-5 mx-5 p-6 shadow-md border border-gray-200 space-y-5">
        {/* Full Name */}
        <View className="flex-row items-start gap-4">
          <Feather name="user" size={22} color="#F59E0B" />
          <View>
            <Text className="body-medium text-gray-400 mb-1">Full Name</Text>
            <Text className="paragraph-medium text-black">{user.name}</Text>
          </View>
        </View>

        {/* Email */}
        <View className="flex-row items-start gap-4">
          <Feather name="mail" size={22} color="#F59E0B" />
          <View>
            <Text className="body-medium text-gray-400 mb-1">Email</Text>
            <Text className="paragraph-medium text-black">{user.email}</Text>
          </View>
        </View>

        {/* Phone number */}
        <View className="flex-row items-start gap-4">
          <Feather name="phone" size={22} color="#F59E0B" />
          <View>
            <Text className="body-medium text-gray-400 mb-1">Phone number</Text>
            <Text className="paragraph-medium text-black">
              {user.phone || "+1 555 123 4567"}
            </Text>
          </View>
        </View>

        {/* Address 1 */}
        <View className="flex-row items-start gap-4">
          <Entypo name="location-pin" size={22} color="#F59E0B" />
          <View>
            <Text className="body-medium text-gray-400 mb-1">
              Address 1 - (Home)
            </Text>
            <Text className="paragraph-medium text-black">
              {user.addressHome || "123 Main Street, Springfield, IL 62704"}
            </Text>
          </View>
        </View>

        {/* Address 2 */}
        <View className="flex-row items-start gap-4">
          <Entypo name="location-pin" size={22} color="#F59E0B" />
          <View>
            <Text className="body-medium text-gray-400 mb-1">
              Address 2 - (Work)
            </Text>
            <Text className="paragraph-medium text-black">
              {user.addressWork || "221B Rose Street, Foodville, FL 12345"}
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-10 px-3">
        <Pressable
          onPress={handleLogout}
          className="w-full py-3 items-center rounded-full border border-rose-500 bg-white"
        >
          <Text className="text-rose-500 font-quicksand-semibold text-base">
            Logout
          </Text>
        </Pressable>
      </View>

      {/* Bottom Padding */}
      <View className="h-10" />
    </SafeAreaView>
  );
}

function ProfileRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View className="space-y-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <View className="flex-row items-center space-x-2">
        {icon === "location-pin" ? (
          <Entypo name={icon as any} size={18} color="#F59E0B" />
        ) : (
          <Feather name={icon as any} size={18} color="#F59E0B" />
        )}
        <Text className="text-sm text-black">{value}</Text>
      </View>
    </View>
  );
}
