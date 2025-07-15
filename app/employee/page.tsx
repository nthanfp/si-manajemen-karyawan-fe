"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import {
    TextInput,
    Select,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    Textarea,
} from "flowbite-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
} from "flowbite-react";

interface Employee {
    id: number;
    full_name: string;
    position: string;
    email: string;
    phone: string;
    date_joined: string;
}

const defaultFormState = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    date_of_birth: "",
    date_joined: "",
    address: "",
    status: "active",
    department_id: 1,
    role_id: 2,
};

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [search, setSearch] = useState("");
    const [position, setPosition] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState(defaultFormState);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    const fetchEmployees = async () => {
        setIsLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (position) params.append("position", position);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees?${params.toString()}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Gagal memuat data");

            const data = await res.json();
            setEmployees(data.data);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat mengambil data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEmployees();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleEditClick = async (id: number) => {
        setEditMode(true);
        setSelectedId(id);
        setOpenModal(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Gagal mengambil data");

            const data = await res.json();
            setFormData(data.data);
        } catch {
            alert("Gagal memuat data karyawan.");
        }
    };

    const handleSaveEmployee = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editMode ? "PUT" : "POST";
            const url = editMode
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees/${selectedId}`
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Gagal menyimpan data");

            setOpenModal(false);
            setFormData(defaultFormState);
            setEditMode(false);
            setSelectedId(null);
            fetchEmployees();
        } catch {
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    const handleDeleteEmployee = async (id: number) => {
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus karyawan ini?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Gagal menghapus data");

            fetchEmployees();
        } catch {
            alert("Terjadi kesalahan saat menghapus data.");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Data Karyawan</h1>

                <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-grow min-w-[200px]">
                        <TextInput
                            placeholder="Cari nama karyawan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <Select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Semua Jabatan</option>
                            <option value="Manager">Manager</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Staff">Staff</option>
                            <option value="Non Staff">Non Staff</option>
                        </Select>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Button type="submit" className="w-full">
                            Terapkan
                        </Button>
                    </div>
                </form>

                <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">Hasil Pencarian</p>
                    <Button
                        color="blue"
                        onClick={() => {
                            setOpenModal(true);
                            setEditMode(false);
                            setFormData(defaultFormState);
                        }}
                    >
                        Tambah Data
                    </Button>
                </div>

                {isLoading && <p className="text-gray-500 dark:text-gray-300">Memuat data...</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>Nama</TableHeadCell>
                                    <TableHeadCell>Jabatan</TableHeadCell>
                                    <TableHeadCell>Email</TableHeadCell>
                                    <TableHeadCell>No HP</TableHeadCell>
                                    <TableHeadCell>Tanggal Masuk</TableHeadCell>
                                    <TableHeadCell>
                                        <span className="sr-only">Aksi</span>
                                    </TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y">
                                {employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <TableRow
                                            key={emp.id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {emp.full_name}
                                            </TableCell>
                                            <TableCell>{emp.position}</TableCell>
                                            <TableCell>{emp.email}</TableCell>
                                            <TableCell>{emp.phone}</TableCell>
                                            <TableCell>{formatDate(emp.date_joined)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 py-2">
                                                    <Button size="xs" color="yellow" onClick={() => handleEditClick(emp.id)}>
                                                        Edit
                                                    </Button>
                                                    <Button size="xs" color="red" onClick={() => handleDeleteEmployee(emp.id)}>
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                                            Data tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Modal
                show={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setFormData(defaultFormState);
                    setEditMode(false);
                    setSelectedId(null);
                }}
            >
                <ModalHeader>{editMode ? "Edit Karyawan" : "Tambah Karyawan"}</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSaveEmployee} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label>Nama Depan</Label>
                                <TextInput
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <Label>Nama Belakang</Label>
                                <TextInput
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Email</Label>
                            <TextInput
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label>No HP</Label>
                            <TextInput
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label>Jabatan</Label>
                            <Select
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                required
                            >
                                <option value="">Pilih Jabatan</option>
                                <option value="Manager">Manager</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Staff">Staff</option>
                                <option value="Non Staff">Non Staff</option>
                            </Select>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label>Tanggal Lahir</Label>
                                <TextInput
                                    type="date"
                                    value={formData.date_of_birth}
                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <Label>Tanggal Masuk</Label>
                                <TextInput
                                    type="date"
                                    value={formData.date_joined}
                                    onChange={(e) => setFormData({ ...formData, date_joined: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Alamat</Label>
                            <Textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" color="blue" className="w-full">
                            Simpan
                        </Button>
                    </form>
                </ModalBody>
            </Modal>
        </AdminLayout>
    );
}
