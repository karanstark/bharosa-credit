# Multi-Step Form Integration Guide

## ✅ Integration Complete

Your Bharosa Credit frontend now has a fully integrated 3-step form modal that appears when users click the "Get Started" button. The form connects seamlessly with your 7-Agent backend pipeline.

---

## 📋 What's New

### User Experience Flow
1. **Landing Page** → User clicks "Get Started" button
2. **Modal Opens** → 3-step form appears
3. **Step 1**: Select country & enter loan amount
4. **Step 2**: Enter document ID (verification)
5. **Step 3**: Upload CSV file with transaction data
6. **Submission** → Sent to 7-Agent pipeline for analysis

### Components Created

#### UI Components (`src/components/ui/`)
| Component | Purpose | Radix UI |
|-----------|---------|----------|
| `card.tsx` | Container layouts | - |
| `progress.tsx` | Progress bar display | `@radix-ui/react-progress` |
| `alert.tsx` | User notifications | - |
| `select.tsx` | Dropdown selects | `@radix-ui/react-select` |
| `tooltip.tsx` | Help tooltips | `@radix-ui/react-tooltip` |
| `multi-step-form.tsx` | Form container | Framer Motion |

#### Main Component
- **`MultiStepFormModal.tsx`** - Complete form logic with validation, API integration, and error handling

---

## 🔧 Testing the Integration

### Local Development
```bash
# Terminal 1: Start Frontend
cd frontend
npm run dev

# Terminal 2: Start Backend
cd backend
python main.py
```

### Test Flow
1. Open browser to `http://localhost:5173`
2. Click "Get Started" button on landing
3. Fill form with test data:
   - **Country**: India
   - **Loan Amount**: 25000
   - **Document ID**: TEST123
   - **Document ID (Confirm)**: TEST123
   - **File**: Upload a valid CSV file (must have at least 5 rows)

### Expected Behavior
✅ Modal appears with smooth animation
✅ Progress bar updates as you move through steps
✅ Form validation prevents incomplete submissions
✅ Loading indicator shows during processing
✅ Success: Redirects to Dashboard with results
✅ Error: Shows error message and allows retry

---

## 📊 API Contract

### Form Data Sent to Backend
```
POST /analyze
Content-Type: multipart/form-data

{
  file: <CSV File>,
  requested_amount: <number>
}
```

### Backend Response (7-Agent Pipeline)
The backend processes the data through:
1. Data Agent - Validates CSV structure
2. Feature Agent - Extracts financial features
3. Scoring Agent - Calculates credit score
4. Compliance Agent - Checks RBI guidelines
5. Decision Agent - Makes credit decision (LLM)
6. Explanation Agent - Generates explanation (LLM)
7. Report Agent - Synthesizes final report

---

## 🎨 Customization

### Form Steps (3 Current Steps)
Located in `MultiStepFormModal.tsx`:
- **Step 1** (Lines 208-247): Document details
- **Step 2** (Lines 249-284): Verification
- **Step 3** (Lines 286-327): File upload

### State Management
Form state managed locally in component:
```typescript
const [formData, setFormData] = useState({
  country: "",
  loanAmount: "20000",
  registrationNumber: "",
  confirmRegistrationNumber: "",
  documentFile: null,
});
```

### Styling
All components use:
- **Tailwind CSS** for styling
- **CVA (Class Variance Authority)** for variants
- **cn()** utility for conditional classes

---

## 📝 Form Validation

### Step 1
- ✓ Country must be selected
- ✓ Loan amount must be > 0

### Step 2
- ✓ Document ID must be entered
- ✓ Document IDs must match (confirmation)

### Step 3
- ✓ CSV file must be selected and valid

---

## 🐛 Troubleshooting

### Modal Not Appearing
- Check browser console for errors
- Verify `MultiStepFormModal` imported in `App.tsx`
- Ensure `showFormModal` state is toggled

### Form Submission Fails
- Check backend is running on `localhost:8000`
- Verify CSV file format (comma-separated)
- Ensure file has at least 5 rows of data
- Check file size < 10MB

### Styling Issues
- Run `npm install` to ensure all dependencies installed
- Clear browser cache
- Rebuild with `npm run build`

---

## 📦 Dependencies Added

```json
{
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tooltip": "^1.0.0",
  "@radix-ui/react-progress": "^1.0.0",
  "@radix-ui/react-icons": "^1.1.0"
}
```

All already compatible with:
- React ^19.2.4
- TypeScript ^5.0
- Tailwind CSS ^4.2.2
- Framer Motion ^12.38.0

---

## ✨ Key Features

✅ **Smooth Animations** - Framer Motion transitions between steps
✅ **Form Validation** - Prevents invalid submissions
✅ **Error Handling** - Clear error messages for user feedback
✅ **Loading States** - Visual feedback during processing
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Accessible** - ARIA labels and semantic HTML
✅ **Type-Safe** - Full TypeScript support

---

## 🚀 Next Steps

1. **Test with sample data** - Use provided CSV files in `backend/data/sample_profiles/`
2. **Customize fields** - Add/remove form fields as needed
3. **Style adjustments** - Modify Tailwind classes for brand consistency
4. **Backend validation** - Add additional validation rules as needed
5. **Analytics** - Add tracking for form submissions

---

## 📞 Support

All components follow shadcn/ui patterns for consistency.
Refer to individual component files for detailed documentation.
