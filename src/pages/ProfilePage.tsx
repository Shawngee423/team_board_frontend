import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProfileHeader from "../components/profile/ProfileHeader";
import SkillsList from "../components/profile/SkillsList";
import ExperienceList from "../components/profile/ExperienceList";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import SkillEditForm from "../components/profile/SkillEditForm";
import { UserService } from "../api/userService";
import { PersonalInfoFull, Person } from "../types/user";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PersonalInfoFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await UserService.getUserFullInfo(parseInt(userId));
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditingSkills(false);
  };

  const handleEditSkillsClick = () => {
    setIsEditingSkills(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEditSkills = () => {
    setIsEditingSkills(false);
  };

  const handleSaveProfile = async (updatedProfile: Person) => {
    if (!userId) return;

    try {
      setLoading(true);
      await UserService.updateUser(parseInt(userId), updatedProfile);

      // 更新成功后重新获取最新数据
      const updatedData = await UserService.getUserFullInfo(parseInt(userId));
      setProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("保存个人资料失败:", error);
      setError("保存失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsSave = async () => {
    if (!userId) return;

    try {
      // 只需要重新加载资料即可，因为技能编辑组件在添加/更新时已经调用了相应API
      setLoading(true);
      const updatedData = await UserService.getUserFullInfo(parseInt(userId));
      setProfile(updatedData);
      setIsEditingSkills(false);
    } catch (error) {
      console.error("获取更新后的技能信息失败:", error);
      setError("更新技能失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-t-lg"></div>
            <div className="h-40 bg-white rounded-b-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="md:col-span-2">
                <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">错误</h2>
          <p className="mb-8">{error || "加载个人资料失败"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            重试
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!isEditing && !isEditingSkills ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">个人资料</h1>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                编辑资料
              </button>
            </div>
            <ProfileHeader profile={profile} />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">技能</h2>
                  <button
                    onClick={handleEditSkillsClick}
                    className="text-sm px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    编辑技能
                  </button>
                </div>
                <SkillsList skills={profile.skills} />
              </div>

              <div className="md:col-span-2">
                <ExperienceList
                  jobExperiences={profile.job_experiences}
                  educationExperiences={profile.education_experiences}
                />
              </div>
            </div>
          </>
        ) : isEditing ? (
          <>
            <div className="mb-6">
              <button
                onClick={handleCancelEdit}
                className="flex items-center text-primary-500 hover:text-primary-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                返回个人资料
              </button>
            </div>
            <ProfileEditForm
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />
          </>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={handleCancelEditSkills}
                className="flex items-center text-primary-500 hover:text-primary-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                返回个人资料
              </button>
            </div>
            <SkillEditForm
              userSkills={profile.skills}
              userId={profile.user_id}
              onSave={handleSkillsSave}
              onCancel={handleCancelEditSkills}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
