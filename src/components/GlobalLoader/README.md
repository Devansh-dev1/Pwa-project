# GlobalLoader Component

A simple, customizable global loading component for the PWA application, similar to the React Native CustamLoder.

## Features

- Rotating image animation (like CustamLoder)
- Customizable image source and size
- Configurable overlay and text colors
- Adjustable rotation speed
- Responsive design

## Usage

```jsx
import GlobalLoader from './components/GlobalLoader';

// Basic usage
<GlobalLoader visible={true} />

// With custom message
<GlobalLoader visible={true} message="Please wait..." />

// Custom image and size
<GlobalLoader 
  visible={true} 
  imageSrc="/path/to/your/image.png"
  imageSize={150}
  message="Loading data..."
/>

// Custom colors and rotation speed
<GlobalLoader 
  visible={true} 
  overlayColor="rgba(0, 0, 0, 0.8)"
  textColor="#00ff00"
  rotationDuration={3}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | `false` | Controls loader visibility |
| `message` | string | `'Loading...'` | Text displayed below loader |
| `imageSrc` | string | `'/src/assets/loadingSearch.png'` | Path to the rotating image |
| `imageSize` | number | `120` | Size of the image in pixels |
| `overlayColor` | string | `'rgba(0, 0, 0, 0.5)'` | Background overlay color |
| `textColor` | string | `'#ffffff'` | Text color |
| `rotationDuration` | number | `2` | Rotation animation duration in seconds |

## Example

### Show loader during API call
```jsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    await api.getData();
  } finally {
    setLoading(false);
  }
};

return (
  <>
    <button onClick={fetchData}>Fetch Data</button>
    <GlobalLoader 
      visible={loading} 
      message="Fetching data..." 
      imageSrc="/assets/loading-icon.png"
      imageSize={100}
    />
  </>
);
```

### Custom styling
```jsx
<GlobalLoader 
  visible={true}
  overlayColor="rgba(0, 0, 0, 0.7)"
  textColor="#ffeb3b"
  rotationDuration={1.5}
  imageSize={80}
/>
```

## Notes

- The component uses CSS animations for smooth rotation
- The image rotates continuously while visible
- The overlay covers the entire screen with a semi-transparent background
- The component is positioned with `z-index: 99999` to appear above all other content
