# **TrendTrivia - Design Document**

Version: 2.0  
Last Updated: June 27, 2024

## **1. Design Philosophy**

TrendTrivia embraces a modern, space-themed aesthetic that combines **Glass Morphism** with an **animated cosmic background**. The design creates an immersive, futuristic experience that makes learning about current events feel like exploring the digital frontier.

### **Core Design Principles:**
- **Clarity First:** Information hierarchy guides users naturally through the quiz experience
- **Glass Morphism:** Translucent, frosted glass effects create depth and sophistication
- **Cosmic Immersion:** Animated space background with particles creates engagement
- **Accessibility:** High contrast ratios and readable typography ensure inclusivity
- **Responsive Design:** Seamless experience across all device sizes

---

## **2. Color Palette**

### **Primary Colors**
- **Primary Cyan:** `#22d3ee` - Main accent color for buttons, highlights, and interactive elements
- **Secondary Purple:** `#a5b4fc` - Supporting accent for variety and visual interest
- **Background Dark:** `#111827` - Deep space background color

### **UI Colors**
- **Text Primary:** `#FFFFFF` - Main text color for maximum readability
- **Text Secondary:** `#E5E7EB` - Supporting text and less prominent information
- **Glass Background:** `rgba(31, 41, 55, 0.1)` - Translucent background for cards
- **Glass Border:** `rgba(34, 211, 238, 0.1)` - Subtle borders with primary color tint

### **Feedback Colors**
- **Success:** `#3FB950` - Correct answers and positive feedback
- **Error:** `#F85149` - Incorrect answers and warnings

---

## **3. Typography**

### **Font Family**
- **Primary Font:** `'Montserrat', sans-serif`
- **Weights Used:** 400 (Regular), 500 (Medium), 700 (Bold)

### **Type Scale**
- **Extra Large:** `2.8rem` - Main headings and hero text
- **Large:** `1.6rem` - Section headings and important text
- **Medium:** `1.1rem` - Body text and buttons
- **Small:** `0.9rem` - Supporting text and labels

### **Text Effects**
- **Glow Effect:** Primary color text shadows for emphasis (`0 0 8px #22d3ee`)
- **High Contrast:** White text on dark backgrounds for readability

---

## **4. Background System**

### **Animated Space Background**
- **Technology:** HTML5 Canvas with 2D rendering context
- **Elements:** 
  - **Planets:** 4-8 animated celestial bodies with gradients and optional rings
  - **Stars:** 25-50 smaller twinkling points of light
  - **Colors:** Primary cyan and secondary purple for variety

### **Animation Properties**
- **Planet Movement:** Slow, continuous drift across the canvas
- **Star Behavior:** Gentle floating motion with opacity variations
- **Performance:** Mobile-optimized with reduced particle counts
- **Responsiveness:** Automatically adjusts to screen size changes

---

## **5. Glass Morphism Effects**

### **Glass Properties**
```css
background: rgba(31, 41, 55, 0.1);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(34, 211, 238, 0.1);
box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.1);
```

### **Application Areas**
- **Quiz Cards:** Main content containers
- **Navigation Elements:** Buttons and interactive components
- **Score Displays:** Results and feedback sections
- **Modal Overlays:** Any popup or overlay content

---

## **6. Component Design Specifications**

### **Homepage (Wireframe Implementation)**
- **Welcome Section:** Glass card with user greeting
- **Main Heading:** "SO YOU THINK YOU ARE UPTO DATE?" with primary color glow
- **Topic Grid:** 2x2 button layout with active/inactive states
- **High Score Display:** Prominent score tracking

### **Quiz Interface**
- **Home Button:** Top-left navigation with glass styling
- **Score Display:** Real-time score tracking in top-right
- **Question Card:** Central glass container with clear typography
- **Answer Options:** Interactive buttons with hover effects

### **Score Page**
- **Results Display:** Celebration of completion with score emphasis
- **High Score Tracking:** Persistent achievement recognition
- **Navigation Options:** Clear paths back to homepage or replay

---

## **7. Interactive States**

### **Button States**
- **Default:** Transparent background with glass border
- **Hover:** Primary color background with glow effect
- **Active:** Pressed state with slight scale reduction
- **Disabled:** Reduced opacity with no-pointer cursor

### **Feedback States**
- **Correct Answer:** Green background with success color
- **Incorrect Answer:** Red background with error color
- **Loading:** Subtle animation or skeleton states

---

## **8. Responsive Design**

### **Breakpoints**
- **Mobile:** `≤ 768px` - Reduced particle count, optimized spacing
- **Tablet:** `769px - 1024px` - Balanced layout with medium particle density
- **Desktop:** `≥ 1025px` - Full experience with maximum visual effects

### **Adaptive Features**
- **Particle System:** Automatically adjusts count based on screen size
- **Typography:** Scalable font sizes for readability
- **Layout:** Flexible grid systems that adapt to available space

---

## **9. Performance Considerations**

### **Optimization Strategies**
- **Canvas Rendering:** Efficient 2D drawing with requestAnimationFrame
- **Memory Management:** Proper cleanup of animation loops
- **Mobile Performance:** Reduced visual complexity on smaller devices
- **Loading States:** Graceful degradation during resource loading

### **Accessibility Features**
- **High Contrast:** Strong color differentiation for visibility
- **Focus States:** Clear keyboard navigation indicators
- **Screen Reader Support:** Semantic HTML structure
- **Motion Sensitivity:** Consideration for users with vestibular disorders

---

## **10. Implementation Status**

### **Completed Elements**
- ✅ Color palette implementation
- ✅ Typography system (Montserrat font)
- ✅ Animated space background
- ✅ Glass morphism effects
- ✅ Responsive component design
- ✅ Interactive state management

### **Technical Architecture**
- ✅ Styled-components for consistent theming
- ✅ Theme provider for global design tokens
- ✅ Canvas-based background animation
- ✅ Mobile-responsive particle system

This design system creates a cohesive, modern experience that transforms the educational quiz format into an engaging, space-age adventure while maintaining usability and accessibility standards. 