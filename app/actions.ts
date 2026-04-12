'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Employee actions
export async function createEmployee(formData: FormData) {
  await prisma.employee.create({
    data: {
      name: formData.get('name') as string,
      department: formData.get('department') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
    },
  })
  revalidatePath('/employees')
}

export async function deleteEmployee(id: number) {
  await prisma.employee.delete({ where: { id } })
  revalidatePath('/employees')
}

// Equipment actions
export async function createEquipment(formData: FormData) {
  await prisma.equipment.create({
    data: {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      assignedTo: formData.get('assignedTo') as string || null,
    },
  })
  revalidatePath('/equipment')
}

export async function deleteEquipment(id: number) {
  await prisma.equipment.delete({ where: { id } })
  revalidatePath('/equipment')
}

// Overtime request actions
export async function createOvertimeRequest(formData: FormData) {
  await prisma.overtimeRequest.create({
    data: {
      employeeName: formData.get('employeeName') as string,
      department: formData.get('department') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      reason: formData.get('reason') as string,
    },
  })
  revalidatePath('/overtime')
}

export async function updateOvertimeStatus(id: number, status: string) {
  await prisma.overtimeRequest.update({ where: { id }, data: { status } })
  revalidatePath('/overtime')
}

export async function deleteOvertimeRequest(id: number) {
  await prisma.overtimeRequest.delete({ where: { id } })
  revalidatePath('/overtime')
}

// Leave request actions
export async function createLeaveRequest(formData: FormData) {
  await prisma.leaveRequest.create({
    data: {
      employeeName: formData.get('employeeName') as string,
      department: formData.get('department') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      reason: formData.get('reason') as string,
    },
  })
  revalidatePath('/leave')
}

export async function updateLeaveStatus(id: number, status: string) {
  await prisma.leaveRequest.update({ where: { id }, data: { status } })
  revalidatePath('/leave')
}

export async function deleteLeaveRequest(id: number) {
  await prisma.leaveRequest.delete({ where: { id } })
  revalidatePath('/leave')
}
