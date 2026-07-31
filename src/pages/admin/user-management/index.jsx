import React, { useState, useMemo } from "react";
import { Shield, UserPlus } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import SearchDebounced from "@/components/debounced/SearchDebounced";
import SelectDebounced from "@/components/debounced/SelectDebounced";
import UserManageTable from "./components/UserManageTable";
import { useGetUsers } from "./hooks";
import useGetRoles from "@/hooks/query/useGetRoles";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import RhfWrapper from "@/components/RhfWrapper";
import Form from "./components/Form";
import { getAddSchema, getEditSchema } from "./schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUser, putUser, deleteUser } from "./users.api";
import { CCE_ROLES, MAX_LIMIT, QUERY_KEYS } from "@/utils/constants";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import ViewDialog from "./components/ViewDialog";
import { postAdminLogout } from "@/api/auth.api";
import { useGetSkills } from "../master-data/hooks";
import { useLanguage } from "@/context/LanguageContext";

export default function UserManagement() {
  const { t } = useLanguage();
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: MAX_LIMIT });
  const {data : skillsApiData} = useGetSkills([1,MAX_LIMIT], {page:1, limit : MAX_LIMIT});
  const skillsOptions = (skillsApiData?.data?.data?.docs || []).map(s=> ({label : s.name, value : s._id}));
  
  const { page, limit, ...pageProps } = usePagination();

  const { data, isLoading, error } = useGetUsers(
    [searchQuery, filterRole, page, limit],
    {
      search: searchQuery,
      role: filterRole,
      page,
      limit,
    },
  );
  const usersData = data?.data?.data?.docs || [];
  const totalPages = data?.data?.data?.pagination?.totalPages || 1;
  console.log({ usersData, totalPages });
  const [editUser, setEditUser] = useState(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteUserRecord, setDeleteUserRecord] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [addInitialValues, setAddInitialValues] = useState({
    name: "",
    email: "",
    loginId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    district: "",
    skills: [],
    preferredLanguages: [],
  });

  const rolesList = rolesApiData?.data?.docs || [];
  const addSchema = useMemo(() => getAddSchema(rolesList), [rolesList]);
  const editSchema = useMemo(() => getEditSchema(rolesList), [rolesList]);

  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      getSuccessToast("User added successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setAddUserOpen(false);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const putMutation = useMutation({
    mutationFn: putUser,
    onSuccess: () => {
      getSuccessToast("User updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setEditUser(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      getSuccessToast("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const [logoutUser, setLogoutUser] = useState(null);

  const logoutMutation = useMutation({
    mutationFn: postAdminLogout,
    onSuccess: () => {
      getSuccessToast("User logged out successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setLogoutUser(null);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const confirmLogout = () => {
    if (logoutUser) {
      logoutMutation.mutate(logoutUser.id);
    }
  };

  const handleLogoutClick = (user) => {
    setLogoutUser(user);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    putMutation.mutate({ id: user.id, data: { status: newStatus } });
  };

  const handleDelete = (user) => {
    setDeleteUserRecord(user);
  };

  const confirmDelete = () => {
    if (deleteUserRecord) {
      deleteMutation.mutate(deleteUserRecord.id);
      setDeleteUserRecord(null);
    }
  };

  const handleView = (user) => {
    setViewUser(user);
  };

  const handleCreateUser = (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      district: formData.district,
      loginId: formData.loginId,
      skills: formData.skills,
      preferredLanguages: formData.preferredLanguages,
    };
    postMutation.mutate(payload);
  };

  const handleUpdateUser = (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role?._id || formData.role,
      district: formData.district,
      loginId: formData.loginId,
      skills: formData.skills,
      preferredLanguages: formData.preferredLanguages,
    };
    putMutation.mutate({ id: editUser.id, data: payload });
  };

  const tableData = (usersData || []).map((user) => {
    return {
      id: user?._id,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role?.designationEnglish || "",
      district: typeof user?.district === "object" ? user?.district?.name || "-" : user?.district || "-",
      status: user?.status || "",
      permissions: user?.permissions || [],
      lastLogin: user?.lastLogin
        ? new Date(user.lastLogin).toLocaleString("en-IN")
        : "Never",
      skills: user?.skills || [],
      preferredLanguages: user?.preferredLanguages || [],
      loginId: CCE_ROLES.includes(user?.role?.designationEnglish) ? user?.loginId : "-",
      apiData: user,
    };
  });

  console.log({ editUser });
  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title={t("User Management & RBAC", "उपयोगकर्ता प्रबंधन और RBAC")}
            subtitle={t("Manage call-centre agents, supervisors, monitoring team & system admins with role-based access control", "भूमिका-आधारित पहुँच नियंत्रण के साथ कॉल-सेंटर एजेंटों, पर्यवेक्षकों, निगरानी टीम और सिस्टम व्यवस्थापकों को प्रबंधित करें")}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setAddInitialValues({
                  name: "",
                  email: "",
                  loginId: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  role: "",
                  district: "",
                });
                setAddUserOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-1" /> {t("Add User", "उपयोगकर्ता जोड़ें")}
            </Button>
            <Button
              onClick={() => {
                const superAdminRole = (rolesApiData?.data?.docs || []).find(
                  (r) => r.designationEnglish === "Admin",
                );
                const superAdminId = superAdminRole?._id || "";
                setAddInitialValues({
                  name: "",
                  email: "",
                  loginId: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  role: superAdminId,
                  district: "",
                });
                setAddUserOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Shield className="w-4 h-4 mr-1" /> {t("Create Admin", "एडमिन बनाएं")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <SearchDebounced
            handleDebouncedChange={(val) => {
              setSearchQuery(val);
              pageProps.setPage(1);
            }}
            className="flex-1"
            delay={500}
            placeholder={t("Search by name ...", "नाम से खोजें ...")}
          />

          <SelectDebounced
            initialValue={filterRole}
            handleInstantChange={(val) => {
              setFilterRole(val);
              pageProps.setPage(1);
            }}
            options={(rolesApiData?.data?.docs || []).map((r) => ({
              label: r.designationEnglish,
              value: r._id,
            }))}
            placeholder={t("Select a role", "भूमिका चुनें")}
            isAll={true}
            allLabel={t("All Roles", "सभी भूमिकाएं")}
          />
        </div>


        {/* Users table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <LoaderErrWrapper isLoading={isLoading} error={error}>
          <div className="overflow-x-auto">
              <UserManageTable
                users={tableData}
                handleToggleStatus={handleToggleStatus}
                setEditUser={setEditUser}
                handleDelete={handleDelete}
                handleView={handleView}
                handleLogoutClick={handleLogoutClick}
              />
          </div>
            </LoaderErrWrapper>
          <Pagination
            page={page}
            limit={limit}
            totalPage={totalPages}
            isLoading={isLoading}
            {...pageProps}
          />
        </div>
        {editUser && (
          <EditDialog
            isHideFooter
            onClose={() => setEditUser(null)}
            title={"Edit User"}
          >
            <RhfWrapper
              initialValues={{
                name: editUser?.apiData?.name || "",
                email: editUser?.apiData?.email || "",
                loginId: editUser?.apiData?.loginId || "",
                phone: editUser?.apiData?.phone || "",
                password: editUser?.apiData?.password || "",
                confirmPassword: editUser?.apiData?.password || "",
                role: editUser?.apiData?.role?._id || "",
                district:
                  editUser?.apiData?.district?._id ||
                  editUser?.apiData?.district ||
                  "",
                status: editUser?.apiData?.status || "",
                skills: (editUser?.apiData?.skills || []).map(s => s._id || s),
                preferredLanguages: editUser?.apiData?.preferredLanguages || [],
              }}
              isValidation={true}
              validationSchema={editSchema}
              onSubmit={(formData) => {
                const { confirmPassword, ...submitData } = formData;
                putMutation.mutate({
                  userId: editUser.id,
                  user: submitData,
                });
              }}
            >
              <Form
                isEdit={true}
                isLoading={putMutation.isPending}
                onCancel={() => setEditUser(null)}
                skillsOptions={skillsOptions}
              />
            </RhfWrapper>
          </EditDialog>
        )}

        {addUserOpen && (
          <EditDialog
            isHideFooter
            onClose={() => setAddUserOpen(false)}
            title={"Add New User"}
          >
            <RhfWrapper
              initialValues={addInitialValues}
              isValidation={true}
              validationSchema={addSchema}
              onSubmit={(formData) => {
                const { confirmPassword, ...submitData } = formData;
                postMutation.mutate(submitData);
              }}
            >
              <Form
                isEdit={false}
                isLoading={postMutation.isPending}
                submitLabel="Add User"
                disabledKeys={[
                  ...(!!addInitialValues.role ? ["role"] : []),
                ].flat()}
                onCancel={() => setAddUserOpen(false)}
                skillsOptions={skillsOptions}
              />
            </RhfWrapper>
          </EditDialog>
        )}

        {deleteUserRecord && (
          <DeleteDialog
            title={deleteUserRecord.name}
            onClose={() => setDeleteUserRecord(null)}
            deleting={deleteMutation.isPending}
            onDelete={() => {
              deleteMutation.mutate(deleteUserRecord.id, {
                onSuccess: () => {
                  setDeleteUserRecord(null);
                },
              });
            }}
          />
        )}
        {viewUser && (
          <EditDialog
            isHideFooter
            onClose={() => setViewUser(null)}
            title="User Details"
          >
            <ViewDialog viewUser={viewUser} setViewUser={setViewUser} />
          </EditDialog>
        )}

        {logoutUser && (
          <EditDialog
            title="Confirm Logout"
            onClose={() => setLogoutUser(null)}
            onSave={confirmLogout}
            saving={logoutMutation.isPending}
          >
            <div className="text-sm text-muted-foreground py-2">
              Are you sure you want to force logout{" "}
              <strong>{logoutUser.name}</strong>? This will terminate their
              active session.
            </div>
          </EditDialog>
        )}

        {/* RBAC info */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
          <h4 className="font-bold text-primary mb-2 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" /> Role-Based Access Control (RBAC)
          </h4>
          <p className="text-sm text-primary">
            Secure role-based access control is enforced for State CC agents,
            field officers, Nodal Officers, State Monitoring Teams, and System
            Admins. Each role has predefined permission scopes - customizable
            per user via the Manage Links section.
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
