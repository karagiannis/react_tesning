# Volt Pro - Users Page Analysis

**Datum:** 2025-10-31  
**Källa:** `volt-pro-react-dashboard-main/src/pages/Users.js`

---

## Översikt

Volt Pro har en Users List-sida med komplett funktionalitet för användarhantering. Denna kan användas som inspiration för vår Settings-sida (User Management).

---

## Struktur

### Header Section
```jsx
<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
  <div className="d-block mb-4 mb-md-0">
    <Breadcrumb>...</Breadcrumb>
    <h4>Users List</h4>
    <p>Your web analytics dashboard template.</p>
  </div>
  <div className="btn-toolbar mb-2 mb-md-0">
    <Button variant="gray-800" size="sm">
      <PlusIcon /> New User
    </Button>
    <ButtonGroup className="ms-2 ms-lg-3">
      <Button>Share</Button>
      <Button>Export</Button>
    </ButtonGroup>
  </div>
</div>
```

**Features:**
- Breadcrumb navigation (Home > Volt > Users List)
- Title + beskrivning
- **"New User" knapp** (höger) - Detta är vad vi behöver!
- Share/Export knappar

---

## Filter/Sök Section

```jsx
<div className="table-settings mb-4">
  <Row>
    <Col xs={9} lg={8} className="d-md-flex">
      {/* Sökfält */}
      <InputGroup className="me-2 me-lg-3 fmxw-300">
        <InputGroup.Text>
          <SearchIcon />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search users"
          value={searchValue}
          onChange={changeSearchValue}
        />
      </InputGroup>
      
      {/* Status filter */}
      <Form.Select value={statusFilter} onChange={changeStatusFilter}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </Form.Select>
    </Col>
    
    <Col xs={3} lg={4}>
      {/* Settings dropdowns (Show 10/20/30) */}
    </Col>
  </Row>
</div>
```

**Features:**
- Real-time search (filtrerar på `user.name`)
- Status dropdown (All/Active/Inactive/Pending/Suspended)
- Pagination settings (10/20/30 rows)

---

## State Management

```javascript
const [users, setUsers] = useState(USERS_DATA.map(u => ({ 
  ...u, 
  isSelected: false, 
  show: true 
})));
const [searchValue, setSearchValue] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const selectedUsersIds = users.filter(u => u.isSelected).map(u => u.id);
const totalUsers = users.length;
const allSelected = selectedUsersIds.length === totalUsers;
```

**User object structure:**
```javascript
{
  id: number,
  name: string,
  status: "active" | "inactive" | "pending" | "suspended",
  isSelected: boolean,  // För bulk actions
  show: boolean,        // För filtrering
  // ... andra fält
}
```

---

## Key Functions

### 1. Search
```javascript
const changeSearchValue = (e) => {
  const newSearchValue = e.target.value;
  const newUsers = users.map(u => ({ 
    ...u, 
    show: u.name.toLowerCase().includes(newSearchValue.toLowerCase()) 
  }));
  
  setSearchValue(newSearchValue);
  setUsers(newUsers);
};
```

### 2. Status Filter
```javascript
const changeStatusFilter = (e) => {
  const newStatusFilter = e.target.value;
  const newUsers = users.map(u => ({ 
    ...u, 
    show: u.status === newStatusFilter || newStatusFilter === "all" 
  }));
  
  setStatusFilter(newStatusFilter);
  setUsers(newUsers);
};
```

### 3. Select All
```javascript
const selectAllUsers = () => {
  const newUsers = selectedUsersIds.length === totalUsers ?
    users.map(u => ({ ...u, isSelected: false })) :
    users.map(u => ({ ...u, isSelected: true }));
  
  setUsers(newUsers);
};
```

### 4. Delete Users (SweetAlert2)
```javascript
const deleteUsers = async (ids) => {
  const usersToBeDeleted = ids ? ids : selectedUsersIds;
  const usersNr = usersToBeDeleted.length;
  const textMessage = usersNr === 1
    ? "Are you sure do you want to delete this user?"
    : `Are you sure do you want to delete these ${usersNr} users?`;

  const result = await SwalWithBootstrapButtons.fire({
    icon: "error",
    title: "Confirm deletion",
    text: textMessage,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel"
  });

  if (result.isConfirmed) {
    const newUsers = users.filter(f => !usersToBeDeleted.includes(f.id));
    const confirmMessage = usersNr === 1 
      ? "The user has been deleted." 
      : "The users have been deleted.";

    setUsers(newUsers);
    await SwalWithBootstrapButtons.fire('Deleted', confirmMessage, 'success');
  }
};
```

---

## UsersTable Component

```jsx
<UsersTable
  users={users.filter(u => u.show)}  // Endast synliga users
  allSelected={allSelected}
  selectUser={selectUser}
  deleteUsers={deleteUsers}
  selectAllUsers={selectAllUsers}
/>
```

**Props:**
- `users` - Filtrerad lista av användare
- `allSelected` - Boolean för "select all" checkbox
- `selectUser(id)` - Toggle selection för en user
- `deleteUsers(ids?)` - Ta bort markerade users (eller specifika ids)
- `selectAllUsers()` - Toggle alla checkboxes

---

## Dependencies

```javascript
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
```

**SweetAlert2** används för:
- Bekräfta radering (modal dialog)
- Visa success meddelande efter radering

---

## Vad vi kan återanvända

### För vår Settings-sida (User Management):

1. ✅ **Header layout** - Breadcrumb + Title + "Add User" knapp
2. ✅ **Search + Filter** - Real-time search och status filter
3. ✅ **Bulk actions** - Select all + delete selected
4. ✅ **SweetAlert2** - Bekräftelse dialogs
5. ✅ **Table pattern** - UsersTable component med props
6. ✅ **State management** - `isSelected`, `show` flags för filtering

### För vår User Management (från SettingsPage.md):

**Nuvarande spec:**
```
- Email field (read-only för invited user)
- Role dropdown (Admin/User/Granskning)
- Permissions checkboxes
- Send Invite knapp
```

**Volt Pro inspirerade tillägg:**
- Search field för att hitta users
- Status filter (Active/Pending/Inactive)
- Bulk delete selected users
- SweetAlert2 för bekräftelser

---

## UsersTable Component Location

**Nästa steg:** Kika på `components/Tables.js` för att se UsersTable implementation:
- Checkbox column för selection
- User info columns (name, email, status, etc.)
- Actions column (edit/delete buttons)
- Pagination

---

## "New User" knapp - Modal?

**Fråga:** När man klickar "New User", öppnar den en modal eller navigerar till ny sida?

**Hypotes:** Troligen modal (Bootstrap Modal) för att matcha Volt Pro's pattern.

**TODO:** 
1. Kika på `UsersTable` component
2. Se om det finns en "Add User" modal i projektet
3. Kolla `examples/` eller `components/` för Form modals

---

## Integration med vår Settings-sida

**Plan:**
1. Kopiera header structure från Users.js
2. Återanvänd search/filter pattern
3. Implementera UsersTable-liknande tabell för våra invited users
4. Lägg till SweetAlert2 för delete confirmation
5. Skapa "Add User" modal med:
   - Email field
   - Role dropdown (Admin/User/Granskning)
   - Permissions checkboxes
   - Send Invite knapp

**Se:** `docs/specifications/SettingsPage.md` för vår spec.

---

## Nästa session (hemma):
1. Kika på `components/Tables.js` för UsersTable
2. Leta efter Add User modal i Volt Pro
3. Jämför med vår SettingsPage.md spec
4. Planera iteration 2 med Extensions-Claude
