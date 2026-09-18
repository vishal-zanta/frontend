// for food master data call:
//   1. Types Master
//     GET /external-grievance/master-data/FOOD?type=types
//   2. Categories Master
//     GET /external-grievance/master-data/FOOD?type=categories
//   3. States Master
//     GET /external-grievance/master-data/FOOD?type=states
//   4. Districts Master
//     GET /external-grievance/master-data/FOOD?type=districts&stateId=10
//   5. Blocks Master
//     GET /external-grievance/master-data/FOOD?type=blocks&districtId=1005
//   6. Panchayats Master
//     GET /external-grievance/master-data/FOOD?type=panchayats&blockId=10050298
//   7. Villages Master
//     GET /external-grievance/master-data/FOOD?type=villages&panchayatId=4487

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkIdbDataExpiry } from "../../helpers";
import { getExternalMasterData } from "@/api/externalDept.api";
import { postFormFields } from "@/lib/idb";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useGetFoodOptions = (deptOrConfig = "FOOD") => {
    const departmentCode =
        typeof deptOrConfig === "string"
            ? deptOrConfig
            : deptOrConfig?.departmentCode || "FOOD";

    const [options, setOptions] = useState({
        type: [],
        category: [],
        state: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // fetch static options
    const staticKeys = ["types", "categories", "states"];
    async function fetchStaticOptions() {
        setLoading(true);
        setError(null);
        try {
            const { dataFromDb, isExpired } = await checkIdbDataExpiry(departmentCode);
            if (!dataFromDb || isExpired) {
                let res = await Promise.all(
                    staticKeys.map((key) =>
                        getExternalMasterData(departmentCode, { type: key })
                    )
                );
                res = res.map((r) => r?.data?.data);

                const stateList = Array.isArray(res?.[2]?.data)
                    ? res[2].data
                    : Array.isArray(res?.[2])
                    ? res[2]
                    : [];

                const mappedData = {
                    type: res?.[0].map(v => ({ label: v.typeName, value: v.typeId })),
                    category: res?.[1].map(v => ({ label: v.categoryName, value: v.categoryId })),
                    state: stateList.map(v => ({ label: v.name, value: v.id })),
                };
                setOptions(mappedData);
                await postFormFields(departmentCode, mappedData);
            } else {
                setOptions({
                    type: dataFromDb.fields?.type || [],
                    category: dataFromDb.fields?.category || [],
                    state: dataFromDb.fields?.state || [],
                });
            }
        } catch (err) {
            console.error("Error fetching static food options:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStaticOptions();
    }, [departmentCode]);

    return {
        options,
        loading,
        isLoading: loading,
        error,
        setOptions,
    };
};

export const useGetFoodDistrictOptions = (stateId = 10, departmentCode = "FOOD") => {
    const {
        data: districtOptions = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["food-districts", departmentCode, stateId],
        queryFn: async () => {
            const res = await getExternalMasterData(departmentCode, {
                type: "districts",
                stateId,
            });
            const resData = res?.data?.data;
            const list = Array.isArray(resData?.data)
                ? resData.data
                : Array.isArray(resData)
                ? resData
                : [];

            return list.map((v) => ({
                label: v.name || v.districtName || v.label,
                value: v.id ?? v.districtId ?? v.districtCode ?? v.value,
            }));
        },
        enabled: Boolean(stateId && departmentCode),
        staleTime: CACHE_TIME,
        gcTime: CACHE_TIME,
    });

    return {
        options: districtOptions,
        districtOptions,
        loading: isLoading,
        isLoading,
        error,
        refetch,
    };
};

export const useGetFoodBlockOptions = (districtId, departmentCode = "FOOD") => {
    const {
        data: blockOptions = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["food-blocks", departmentCode, districtId],
        queryFn: async () => {
            const res = await getExternalMasterData(departmentCode, {
                type: "blocks",
                districtId,
            });
            const resData = res?.data?.data;
            const list = Array.isArray(resData?.data)
                ? resData.data
                : Array.isArray(resData)
                ? resData
                : [];

            return list.map((v) => ({
                label: v.name || v.blockName || v.label,
                value: v.id ?? v.blockId ?? v.blockCode ?? v.value,
            }));
        },
        enabled: Boolean(districtId && departmentCode),
        staleTime: CACHE_TIME,
        gcTime: CACHE_TIME,
    });

    return {
        options: blockOptions,
        blockOptions,
        loading: isLoading,
        isLoading,
        error,
        refetch,
    };
};

export const useGetFoodPanchayatOptions = (blockId, departmentCode = "FOOD") => {
    const {
        data: panchayatOptions = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["food-panchayats", departmentCode, blockId],
        queryFn: async () => {
            const res = await getExternalMasterData(departmentCode, {
                type: "panchayats",
                blockId,
            });
            const resData = res?.data?.data;
            const list = Array.isArray(resData?.data)
                ? resData.data
                : Array.isArray(resData)
                ? resData
                : [];

            return list.map((v) => ({
                label: v.name || v.panchayatName || v.label,
                value: v.id ?? v.panchayatId ?? v.panchayatCode ?? v.value,
            }));
        },
        enabled: Boolean(blockId && departmentCode),
        staleTime: CACHE_TIME,
        gcTime: CACHE_TIME,
    });

    return {
        options: panchayatOptions,
        panchayatOptions,
        loading: isLoading,
        isLoading,
        error,
        refetch,
    };
};

export const useGetFoodVillageOptions = (panchayatId, departmentCode = "FOOD") => {
    const {
        data: villageOptions = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["food-villages", departmentCode, panchayatId],
        queryFn: async () => {
            const res = await getExternalMasterData(departmentCode, {
                type: "villages",
                panchayatId,
            });
            const resData = res?.data?.data;
            const list = Array.isArray(resData?.data)
                ? resData.data
                : Array.isArray(resData)
                ? resData
                : [];

            return list.map((v) => ({
                label: v.name || v.villageName || v.label,
                value: v.id ?? v.villageId ?? v.villageCode ?? v.value,
            }));
        },
        enabled: Boolean(panchayatId && departmentCode),
        staleTime: CACHE_TIME,
        gcTime: CACHE_TIME,
    });

    return {
        options: villageOptions,
        villageOptions,
        loading: isLoading,
        isLoading,
        error,
        refetch,
    };
};

// Aliases for convenience
export const useGetDistrictOptions = useGetFoodDistrictOptions;
export const useGetBlockOptions = useGetFoodBlockOptions;
export const useGetPanchayatOptions = useGetFoodPanchayatOptions;
export const useGetPanchayatsOptions = useGetFoodPanchayatOptions;
export const useGetVillageOptions = useGetFoodVillageOptions;
export const useGetVillagesOptions = useGetFoodVillageOptions;