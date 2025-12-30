# E2E Test Suite Documentation

This resume project includes a comprehensive **End-to-End (E2E)** test suite using Playwright, demonstrating professional QA/SDET expertise.

## 🎯 Testing Philosophy

For a vanilla JavaScript static site without a build step, **E2E tests provide the most value** because they:
- Test real user behavior in actual browsers
- Don't require code refactoring to be "testable"
- Validate the complete user experience
- Catch integration issues between HTML, CSS, and JavaScript
- Work across multiple browsers and devices

## 📊 Test Coverage

### Navigation & Page Load (`navigation.spec.js`)
- Page loads without console errors
- All sections render correctly
- Profile image loads properly
- Meta tags and SEO elements present
- Contact icons functional

### Language Toggle (`language-toggle.spec.js`)
- Switch between English and Spanish
- Persist language preference in localStorage
- Update all section titles dynamically
- Update content in achievements, skills, education
- Language item selection

### Download Modal (`download-modal.spec.js`)
- Open/close modal functionality
- Display 4 download options (MD/PDF × EN/ES)
- Bilingual modal content
- File download triggers
- Click-outside-to-close behavior

### Carousels (`carousels.spec.js`)
- Summary carousel navigation (prev/next buttons)
- Carousel indicator updates
- Auto-advance every 5 seconds
- Karaoke text effect on active items
- Experience swiper initialization
- Expand/collapse experience details

### Responsive Design (`responsive.spec.js`)
- Mobile layout (375px)
- Tablet layout (768px)
- Desktop layout (1920px)
- Image aspect ratio preservation
- Contact icons accessibility
- Carousel controls visibility

### User Interactions (`interactions.spec.js`)
- Copy email to clipboard
- Copy phone to clipboard
- Open LinkedIn in new tab
- Notification messages (bilingual)
- Skill tag hover effects
- Institution link navigation
- Keyboard navigation
- Profile image hover effect

## 🚀 Running Tests

### Install dependencies
```bash
npm install
```

### Install Playwright browsers (first time only)
```bash
npm run playwright:install
```

### Run all tests (headless)
```bash
npm test
```

### Run tests with visible browser
```bash
npm run test:headed
```

### Run tests with Playwright UI (recommended)
```bash
npm run test:ui
```

### Debug tests step-by-step
```bash
npm run test:debug
```

### Run tests on specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:mobile
```

### View HTML test report
```bash
npm run test:report
```

## 📈 Test Metrics

- **Total Tests**: 50+ E2E test cases
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Mobile**: Pixel 5, iPhone 13
- **Coverage**: All critical user journeys

## 🔄 Continuous Integration

Tests run automatically on **GitHub Actions**:
- ✅ On every push to `main` or `develop`
- ✅ On every pull request
- ✅ Across Chromium and Firefox
- ✅ Test reports uploaded as artifacts
- ✅ Videos recorded on failure

## 🧪 Test Strategy

### What we test:
- ✅ Language switching and persistence
- ✅ Clipboard operations with notifications
- ✅ Download modal complete workflow
- ✅ Carousel navigation (manual + autoplay)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User interactions (clicks, hover, keyboard)
- ✅ Dynamic content rendering
- ✅ Error-free page load
- ✅ Cross-browser compatibility

### What we don't test:
- ❌ Third-party libraries internals (Swiper.js)
- ❌ Browser API implementations
- ❌ Static content that doesn't change

## 🎨 Why E2E-Only Approach?

For this vanilla JS project, we chose E2E tests over unit/integration tests because:

1. **No Build Step**: The code runs directly in the browser without transpilation
2. **Global Scope**: Functions aren't modularized with ES6 exports
3. **DOM Dependencies**: Most code directly manipulates the DOM
4. **User Value**: E2E tests validate what users actually experience
5. **Pragmatism**: Refactoring to enable unit tests would be over-engineering

This is a **professional QA decision**: choose the right testing strategy for the project architecture.

## 🐛 Debugging Failed Tests

### 1. Run with headed browser
```bash
npm run test:headed
```

### 2. Use Playwright UI (best option)
```bash
npm run test:ui
```

### 3. Debug specific test
```bash
npx playwright test tests/e2e/navigation.spec.js --debug
```

### 4. View trace on failure
```bash
npx playwright show-trace trace.zip
```

### 5. Check screenshots/videos
Test failures automatically capture:
- Screenshots: `test-results/*/test-failed-*.png`
- Videos: `test-results/*/video.webm` (if configured)

## 📚 Playwright Features Used

- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Mobile emulation**: Pixel 5, iPhone 13
- **Auto-wait**: No flaky tests from timing issues
- **Trace recording**: Debug failures with timeline
- **Parallel execution**: Fast test runs
- **Test isolation**: Each test starts fresh
- **Screenshot on failure**: Visual debugging
- **HTML reports**: Beautiful test results

## 🎓 Key Testing Patterns Demonstrated

1. **Page Object Model** (implicit): Locators defined in tests
2. **Arrange-Act-Assert**: Clear test structure
3. **Test Isolation**: Each test is independent
4. **Cross-browser**: Same tests on multiple browsers
5. **Responsive**: Tests across viewport sizes
6. **Accessibility**: Keyboard navigation, ARIA labels
7. **User-centric**: Test real user workflows

## 📝 Adding New Tests

### Test File Template
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/');

    // Arrange: Setup test state

    // Act: Perform user action
    await page.locator('.element').click();

    // Assert: Verify expected result
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices
- One assertion per test (when possible)
- Descriptive test names: "should [expected behavior]"
- Use data-testid for stable selectors
- Avoid hardcoded waits, use auto-waiting
- Test user journeys, not implementation details

## 🏆 Professional QA Showcase

This test suite demonstrates:
- ✅ **Test Strategy**: E2E focus appropriate for vanilla JS
- ✅ **Tool Selection**: Playwright (industry standard)
- ✅ **Cross-browser**: Multi-browser validation
- ✅ **CI/CD**: Automated testing in pipeline
- ✅ **Coverage**: 50+ tests for critical paths
- ✅ **Maintainability**: Clear, documented tests
- ✅ **Debugging**: Multiple debugging approaches
- ✅ **Real-world**: Practical testing approach

---

**Test Results**: Check CI/CD badges in main README or run locally with `npm test`
