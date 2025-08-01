# AUTOMATED TEST RESULTS

**Test Run:** 2025-07-30T07:35:22.423Z
**Total Tests:** 6
**Passed:** 6
**Failed:** 0
**Success Rate:** 100%

## Detailed Results

### Dev Server Running
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.041Z
**Result:** {
  "port": 5173,
  "status": "running"
}

### QuizPageSimple Timeframe Integration
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.045Z
**Result:** {
  "checks": {
    "hasDurationExtraction": true,
    "hasMappingFunction": true,
    "hasTimeframeParam": true,
    "hasVisualIndicator": true,
    "hasEnhancedLogging": true
  },
  "passedChecks": 5
}

### Service Layer Timeframe Support
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.048Z
**Result:** {
  "checks": {
    "firestoreTimeframe": true,
    "firestoreMetadata": true,
    "batchTimeframe": true,
    "batchFiltering": true
  },
  "passedChecks": 4
}

### Prompt Files Accessibility
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.053Z
**Result:** {
  "results": {
    "ai_components/prompts/last_week_prompt.md": {
      "exists": true,
      "size": 3067,
      "hasTimeframeField": true,
      "hasFreshnessRule": true
    },
    "ai_components/prompts/last_month_prompt.md": {
      "exists": true,
      "size": 3054,
      "hasTimeframeField": true,
      "hasFreshnessRule": true
    },
    "ai_components/prompts/last_year_prompt.md": {
      "exists": true,
      "size": 3325,
      "hasTimeframeField": true,
      "hasFreshnessRule": true
    }
  },
  "accessible": 3
}

### Data Flow Mapping
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.055Z
**Result:** {
  "results": [
    {
      "input": "week",
      "expected": "last_week",
      "actual": "last_week",
      "passed": true
    },
    {
      "input": "month",
      "expected": "last_month",
      "actual": "last_month",
      "passed": true
    },
    {
      "input": "year",
      "expected": "last_year",
      "actual": "last_year",
      "passed": true
    }
  ],
  "passedTests": 3
}

### Web App Loading
**Status:** PASSED
**Time:** 2025-07-30T07:35:23.756Z
**Result:** {
  "checks": {
    "hasContent": true,
    "hasReactRoot": true,
    "noErrors": true
  },
  "pageLength": 1021,
  "activePort": 5173
}

