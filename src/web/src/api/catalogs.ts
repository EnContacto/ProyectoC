import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type {
  AccountingAccountDto,
  CategoryDto,
  CompanyDto,
  CustodianDto,
  LocationDto,
} from './dto'

const STALE = 5 * 60 * 1000

export const catalogKeys = {
  companies: ['catalogs', 'companies'] as const,
  categories: ['catalogs', 'categories'] as const,
  locations: ['catalogs', 'locations'] as const,
  custodians: ['catalogs', 'custodians'] as const,
  accounts: ['catalogs', 'accounts'] as const,
}

export function useCompanies() {
  return useQuery({
    queryKey: catalogKeys.companies,
    queryFn: async () => (await api.get<CompanyDto[]>('/companies')).data,
    staleTime: STALE,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn: async () => (await api.get<CategoryDto[]>('/categories')).data,
    staleTime: STALE,
  })
}

export function useLocations() {
  return useQuery({
    queryKey: catalogKeys.locations,
    queryFn: async () => (await api.get<LocationDto[]>('/locations')).data,
    staleTime: STALE,
  })
}

export function useCustodians() {
  return useQuery({
    queryKey: catalogKeys.custodians,
    queryFn: async () => (await api.get<CustodianDto[]>('/custodians')).data,
    staleTime: STALE,
  })
}

export function useAccountingAccounts() {
  return useQuery({
    queryKey: catalogKeys.accounts,
    queryFn: async () => (await api.get<AccountingAccountDto[]>('/accounting-accounts')).data,
    staleTime: STALE,
  })
}