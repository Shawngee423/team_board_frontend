import React, { useState, useEffect } from "react";
import { SkillInfoResponse, Skill } from "../../types/skill";
import { SkillService } from "../../api/skillService";
import { UserService } from "../../api/userService";

interface SkillEditFormProps {
  userSkills: SkillInfoResponse[];
  userId: number;
  onSave: () => void;
  onCancel: () => void;
}

const SkillEditForm: React.FC<SkillEditFormProps> = ({
  userSkills,
  userId,
  onSave,
  onCancel,
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | "">("");
  const [skillLevel, setSkillLevel] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);

  // 用户当前技能（可编辑）
  const [editableUserSkills, setEditableUserSkills] = useState<
    SkillInfoResponse[]
  >([]);
  // 跟踪已删除的技能ID
  const [removedSkillIds, setRemovedSkillIds] = useState<number[]>([]);
  // 跟踪已更新的技能
  const [updatedSkills, setUpdatedSkills] = useState<Map<number, number>>(
    new Map()
  );

  // 加载所有可用技能
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const allSkills = await SkillService.getAllSkills();
        setSkills(allSkills);
        setEditableUserSkills([...userSkills]);
      } catch (err) {
        console.error("获取技能列表失败:", err);
        setError("无法加载技能列表");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userSkills]);

  // 添加技能到用户
  const handleAddSkill = async () => {
    if (!selectedSkillId) return;

    try {
      setIsSubmitting(true);

      // 找到选中的技能
      const skillId =
        typeof selectedSkillId === "string"
          ? parseInt(selectedSkillId)
          : selectedSkillId;

      const selectedSkill = skills.find((s: Skill) => s.skill_id === skillId);

      if (!selectedSkill) return;

      // 检查技能是否已添加
      const existingSkill = editableUserSkills.find(
        (s: SkillInfoResponse) => s.skill_id === skillId
      );

      if (existingSkill) {
        // 更新现有技能的级别
        setEditableUserSkills((prevSkills: SkillInfoResponse[]) =>
          prevSkills.map((s: SkillInfoResponse) =>
            s.skill_id === skillId ? { ...s, level: skillLevel } : s
          )
        );

        // 记录更新的技能
        setUpdatedSkills(new Map(updatedSkills.set(skillId, skillLevel)));
      } else {
        // 添加新技能
        await UserService.addSkillToUser(userId, skillId, skillLevel);

        // 更新界面
        setEditableUserSkills((prevSkills: SkillInfoResponse[]) => [
          ...prevSkills,
          {
            skill_id: skillId,
            skill_name: selectedSkill.skill_name || "",
            level: skillLevel,
          },
        ]);

        // 如果这个技能之前被移除过，从移除列表中删除
        if (removedSkillIds.includes(skillId)) {
          setRemovedSkillIds(removedSkillIds.filter((id) => id !== skillId));
        }
      }

      // 重置选择
      setSelectedSkillId("");
      setSkillLevel(50);
    } catch (error) {
      console.error("添加技能失败:", error);
      setError("添加技能失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 创建新技能并添加给用户
  const handleCreateAndAddSkill = async () => {
    if (!newSkillName.trim()) return;

    try {
      setIsSubmitting(true);

      // 1. 创建新技能
      const newSkill = await SkillService.createSkill({
        skill_name: newSkillName,
      });

      // 2. 将新技能添加到用户
      await UserService.addSkillToUser(userId, newSkill.skill_id, skillLevel);

      // 3. 更新界面
      setSkills((prevSkills: Skill[]) => [...prevSkills, newSkill]);
      setEditableUserSkills((prevSkills: SkillInfoResponse[]) => [
        ...prevSkills,
        {
          skill_id: newSkill.skill_id,
          skill_name: newSkill.skill_name,
          level: skillLevel,
        },
      ]);

      // 4. 重置表单
      setNewSkillName("");
      setSkillLevel(50);
      setIsAddingNewSkill(false);
    } catch (error) {
      console.error("创建技能失败:", error);
      setError("创建技能失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 从用户中移除技能
  const handleRemoveSkill = (skillId: number) => {
    // 更新UI
    setEditableUserSkills((prevSkills: SkillInfoResponse[]) =>
      prevSkills.filter((s) => s.skill_id !== skillId)
    );

    // 记录已删除的技能ID
    setRemovedSkillIds([...removedSkillIds, skillId]);

    // 如果这个技能在已更新列表中，移除它
    if (updatedSkills.has(skillId)) {
      const newUpdatedSkills = new Map(updatedSkills);
      newUpdatedSkills.delete(skillId);
      setUpdatedSkills(newUpdatedSkills);
    }
  };

  // 更新技能级别
  const handleSkillLevelChange = (skillId: number, level: number) => {
    // 更新UI
    setEditableUserSkills((prevSkills: SkillInfoResponse[]) =>
      prevSkills.map((s) => (s.skill_id === skillId ? { ...s, level } : s))
    );

    // 记录已更新的技能
    setUpdatedSkills(new Map(updatedSkills.set(skillId, level)));
  };

  // 保存所有更改
  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // 创建一个包含原始用户技能的映射，用于快速查找
      const originalSkillMap = new Map();
      userSkills.forEach((skill) => {
        originalSkillMap.set(skill.skill_id, skill.level);
      });

      // 当前编辑后的技能映射
      const currentSkillMap = new Map();
      editableUserSkills.forEach((skill) => {
        currentSkillMap.set(skill.skill_id, skill.level);
      });

      // 操作分为三类：
      // 1. 删除的技能 - 原始列表中有但编辑后列表中没有的
      // 2. 新增的技能 - 原始列表中没有但编辑后列表中有的
      // 3. 修改的技能 - 原始列表和编辑后列表都有，但等级不同的

      const promises = [];

      // 处理所有变更的技能（新增或修改）
      for (const [skillId, level] of currentSkillMap.entries()) {
        const originalLevel = originalSkillMap.get(skillId);

        if (originalLevel === undefined) {
          // 新增的技能
          promises.push(
            UserService.addSkillToUser(userId, skillId, level).catch(
              (error) => {
                console.error(`添加技能 ${skillId} 失败:`, error);
                throw new Error(`添加技能失败: ${error.message}`);
              }
            )
          );
        } else if (originalLevel !== level) {
          // 修改的技能 - 因为后端没有提供更新API，我们采用以下策略：
          // 先尝试删除（设置level为0），然后重新添加
          promises.push(
            UserService.addSkillToUser(userId, skillId, 0)
              .then(() => UserService.addSkillToUser(userId, skillId, level))
              .catch((error) => {
                console.error(`更新技能 ${skillId} 失败:`, error);
                throw new Error(`更新技能失败: ${error.message}`);
              })
          );
        }
        // 如果等级没变，不做任何操作
      }

      // 处理删除的技能
      for (const [skillId, _] of originalSkillMap.entries()) {
        if (!currentSkillMap.has(skillId)) {
          promises.push(
            UserService.addSkillToUser(userId, skillId, 0).catch((error) => {
              console.error(`删除技能 ${skillId} 失败:`, error);
              throw new Error(`删除技能失败: ${error.message}`);
            })
          );
        }
      }

      // 顺序执行所有操作，而不是并行，以避免并发问题
      for (const promise of promises) {
        await promise;
      }

      // 通知父组件保存成功
      onSave();
    } catch (error) {
      console.error("save failed:", error);
      setError(`保存失败: ${error.message || "please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // 过滤出用户还没有的技能
  const availableSkills = skills.filter(
    (skill) =>
      !editableUserSkills.some(
        (userSkill) => userSkill.skill_id === skill.skill_id
      )
  );

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <h2 className="text-xl font-bold mb-4">edit skills</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* 当前用户技能列表 */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">my skills</h3>

        {editableUserSkills.length === 0 ? (
          <p className="text-gray-500 italic">you have no skill</p>
        ) : (
          <div className="space-y-4">
            {editableUserSkills.map((skill) => (
              <div key={skill.skill_id} className="border rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.skill_name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.skill_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    delete
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 w-12">
                    {skill.level}%
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={skill.level}
                    onChange={(e) =>
                      handleSkillLevelChange(
                        skill.skill_id,
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-grow"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加新技能 */}
      <div className="mb-6 border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-2">add skill</h3>

        {isAddingNewSkill ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新技能名称
              </label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="输入新技能名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                skill level{skillLevel}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={skillLevel}
                onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCreateAndAddSkill}
                disabled={isSubmitting || !newSkillName.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? "添加中..." : "添加新技能"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewSkill(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                add skill
              </label>
              <select
                value={selectedSkillId}
                onChange={(e) =>
                  setSelectedSkillId(
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- edit skills --</option>
                {availableSkills.map((skill) => (
                  <option key={skill.skill_id} value={skill.skill_id}>
                    {skill.skill_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                skill level: {skillLevel}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={skillLevel}
                onChange={(e) => setSkillLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={isSubmitting || !selectedSkillId}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
              >
                {isSubmitting ? "adding..." : "add skill"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNewSkill(true)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                add new skill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          cancel
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? "saving..." : "save"}
        </button>
      </div>
    </div>
  );
};

export default SkillEditForm;
