import React, { useState } from "react";
import { Shield, UserPlus, Mail, Phone, MapPin, Flame } from "lucide-react";
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
import { addSchema, editSchema } from "./schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUser, putUser, deleteUser } from "./users.api";
import { QUERY_KEYS } from "@/utils/constants";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import ViewDialog from "./components/ViewDialog";
import { postAdminLogout } from "@/api/auth.api";

export default function UserManagement() {
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: 100 });
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
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    district: "",
  });

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

  const handleDelete = (user) => {
    setDeleteUserRecord(user);
  };
  const handleView = (user) => {
    setViewUser(user);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    putMutation.mutate({
      userId: user.id,
      user: {
        status: newStatus,
      },
    });
  };

  const tableData = (data?.data?.data?.docs || []).map((user) => {
    const districtVal = user?.district;
    const districtDisplay =
      districtVal && typeof districtVal === "object"
        ? districtVal.name || districtVal._id || ""
        : districtVal || "";

    return {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role?.designationEnglish || "",
      designation: user?.role?.designationEnglish || "",
      district: districtDisplay,
      status: user?.status || "",
      permissions: user?.role?.permissions || [],
      apiData: user,
      lastLogin: user?.lastLogin
        ? new Date(user?.lastLogin).toLocaleString() || ""
        : "-",
    };
  });
  console.log({ editUser });
  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            title="User Management & RBAC"
            subtitle="Manage call-centre agents, supervisors, monitoring team & system admins with role-based access control"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setAddInitialValues({
                  name: "",
                  email: "",
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
              <UserPlus className="w-4 h-4 mr-1" /> Add User
            </Button>
            <Button
              onClick={() => {
                const superAdminRole = (rolesApiData?.data?.docs || []).find(
                  (r) => r.designationEnglish === "Super Admin",
                );
                const superAdminId = superAdminRole?._id || "";
                setAddInitialValues({
                  name: "",
                  email: "",
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
              <Shield className="w-4 h-4 mr-1" /> Create Super Admin
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
            placeholder="Search by name ..."
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
            placeholder="Select a role"
            isAll={true}
            allLabel={"All Roles"}
          />
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <LoaderErrWrapper isLoading={isLoading} error={error}>
              <UserManageTable
                users={tableData}
                handleToggleStatus={handleToggleStatus}
                setEditUser={setEditUser}
                handleDelete={handleDelete}
                handleView={handleView}
                handleLogoutClick={handleLogoutClick}
              />
            </LoaderErrWrapper>
          </div>
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
                phone: editUser?.apiData?.phone || "",
                password: editUser?.apiData?.password || "",
                confirmPassword: editUser?.apiData?.password || "",
                role: editUser?.apiData?.role?._id || "",
                district:
                  editUser?.apiData?.district?._id ||
                  editUser?.apiData?.district ||
                  "",
                status: editUser?.apiData?.status || "",
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
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
