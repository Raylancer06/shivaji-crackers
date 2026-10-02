@extends('admin.layout')

@section('title', 'Category Management')

@section('content')
<div class="space-y-6">
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="font-serif font-black text-2xl text-[#1C1411]">Category Management</h1>
            <p class="text-xs text-[#66574F] mt-0.5">Organize Sivaji Firecracker product catalog by categories, display sequence, and visibility.</p>
        </div>

        <button onclick="document.getElementById('addCategoryModal').classList.remove('hidden')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold transition shadow-sm self-start sm:self-auto">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>+ Add New Category</span>
        </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-3xl border border-[#E5DBC8] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F5] border-b border-[#E5DBC8] text-[#550C12] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                        <th class="py-3.5 px-4">Order</th>
                        <th class="py-3.5 px-4">Category Name</th>
                        <th class="py-3.5 px-4">Slug</th>
                        <th class="py-3.5 px-4">Icon Identifier</th>
                        <th class="py-3.5 px-4 text-center">Products Count</th>
                        <th class="py-3.5 px-4 text-center">Status</th>
                        <th class="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#E5DBC8]/60 font-sans">
                    @forelse($categories as $category)
                        <tr class="hover:bg-[#FAF8F5]/60 transition">
                            <td class="py-3.5 px-4 font-mono font-bold text-[#B85D00]">
                                {{ $category->display_order }}
                            </td>
                            <td class="py-3.5 px-4 font-bold text-[#1C1411]">
                                {{ $category->name }}
                            </td>
                            <td class="py-3.5 px-4 font-mono text-gray-500">
                                {{ $category->slug }}
                            </td>
                            <td class="py-3.5 px-4 text-gray-600">
                                <span class="bg-gray-100 px-2 py-0.5 rounded font-mono text-[10px]">{{ $category->icon ?? 'sparkles' }}</span>
                            </td>
                            <td class="py-3.5 px-4 text-center">
                                <a href="{{ route('admin.products.index', ['category' => $category->slug]) }}" class="inline-block px-2.5 py-0.5 rounded-full font-bold text-xs bg-amber-50 text-[#B85D00] border border-amber-200 hover:bg-amber-100 transition">
                                    {{ $category->products_count }} products
                                </a>
                            </td>
                            <td class="py-3.5 px-4 text-center">
                                @if($category->is_active ?? true)
                                    <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Active
                                    </span>
                                @else
                                    <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-gray-100 text-gray-600 border border-gray-200">
                                        Hidden
                                    </span>
                                @endif
                            </td>
                            <td class="py-3.5 px-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button onclick="openEditModal({{ json_encode($category) }})" class="p-1.5 rounded-lg text-gray-600 hover:text-[#550C12] hover:bg-gray-100 transition" title="Edit">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    @if($category->products_count == 0)
                                        <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" onsubmit="return confirm('Delete category {{ $category->name }}?')" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition" title="Delete">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="py-8 text-center text-gray-400">No categories found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal: Add Category -->
<div id="addCategoryModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#E5DBC8]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DBC8] mb-4">
            <h3 class="font-serif font-black text-lg text-[#1C1411]">Add New Category</h3>
            <button onclick="document.getElementById('addCategoryModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold">×</button>
        </div>

        <form action="{{ route('admin.categories.store') }}" method="POST" class="space-y-4">
            @csrf
            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Category Name *</label>
                <input type="text" name="name" required placeholder="e.g. Multi-Color Sky Shots" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">URL Slug (Optional)</label>
                <input type="text" name="slug" placeholder="e.g. multi-color-sky-shots" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Display Order</label>
                    <input type="number" name="display_order" value="0" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Icon Key</label>
                    <input type="text" name="icon" value="sparkles" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
                </div>
            </div>

            <label class="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" name="is_active" value="1" checked class="rounded border-gray-300 text-[#550C12] focus:ring-[#C98E2A]">
                <span class="text-xs text-[#1C1411] font-semibold">Active & Visible in Storefront</span>
            </label>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onclick="document.getElementById('addCategoryModal').classList.add('hidden')" class="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-5 py-2.5 bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold rounded-xl transition">Create Category</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal: Edit Category -->
<div id="editCategoryModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-[#E5DBC8]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E5DBC8] mb-4">
            <h3 class="font-serif font-black text-lg text-[#1C1411]">Edit Category</h3>
            <button onclick="document.getElementById('editCategoryModal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold">×</button>
        </div>

        <form id="editCategoryForm" method="POST" class="space-y-4">
            @csrf
            @method('PUT')
            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Category Name *</label>
                <input type="text" id="edit_name" name="name" required class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
            </div>

            <div>
                <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">URL Slug *</label>
                <input type="text" id="edit_slug" name="slug" required class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Display Order</label>
                    <input type="number" id="edit_display_order" name="display_order" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#550C12] uppercase tracking-wider mb-1">Icon Key</label>
                    <input type="text" id="edit_icon" name="icon" class="w-full px-3 py-2 rounded-xl border border-[#E5DBC8] bg-[#FAF8F5] text-xs text-[#1C1411] outline-none focus:bg-white focus:border-[#C98E2A]">
                </div>
            </div>

            <label class="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" id="edit_is_active" name="is_active" value="1" class="rounded border-gray-300 text-[#550C12] focus:ring-[#C98E2A]">
                <span class="text-xs text-[#1C1411] font-semibold">Active & Visible in Storefront</span>
            </label>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onclick="document.getElementById('editCategoryModal').classList.add('hidden')" class="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" class="px-5 py-2.5 bg-[#550C12] hover:bg-[#7B141C] text-white text-xs font-bold rounded-xl transition">Save Changes</button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
function openEditModal(category) {
    document.getElementById('editCategoryForm').action = '/admin/categories/' + category.id;
    document.getElementById('edit_name').value = category.name;
    document.getElementById('edit_slug').value = category.slug;
    document.getElementById('edit_display_order').value = category.display_order || 0;
    document.getElementById('edit_icon').value = category.icon || 'sparkles';
    document.getElementById('edit_is_active').checked = category.is_active !== false && category.is_active !== 0;
    document.getElementById('editCategoryModal').classList.remove('hidden');
}
</script>
@endsection
