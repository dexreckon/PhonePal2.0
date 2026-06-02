/**
 * Shandar Mobiles — Vanilla Javascript Logic
 * Powered by Apple iOS 26 Liquid Design System
 * 100% Compatible with Vercel and Unified Social Media Timeline
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- UI Elements ---
  const form = document.getElementById("analyze-form");
  const productInput = document.getElementById("product-input");
  const searchBtn = document.getElementById("search-btn");
  const recentList = document.getElementById("recent-list");
  
  // Segmented control (Simplified vs Expert)
  const segmentedControl = document.querySelector(".segmented-control");
  const segmentBtns = document.querySelectorAll(".segment-btn");
  
  // Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  
  // Loader & Status
  const loader = document.getElementById("loader");
  const loaderStatus = document.getElementById("loader-status");
  const statusTag = document.getElementById("status-tag");
  
  // Outputs
  const reportMarkdown = document.getElementById("report-markdown");
  const reportTitleText = document.getElementById("report-title-text");
  const reportMetaRow = document.getElementById("report-meta-row");
  const socialFeedList = document.getElementById("social-feed-list");
  
  // Actions
  const btnShare = document.getElementById("btn-share");
  const btnCopy = document.getElementById("btn-copy");
  const shareBox = document.getElementById("share-box");
  const shareUrlText = document.getElementById("share-url-text");
  
  // --- App State ---
  let activeLevel = "simplified";
  let currentReportId = null;
  let currentReportContent = "";
  
  // --- Check API Key and Environment Status ---
  async function checkServerStatus() {
    try {
      const res = await fetch("/status");
      const data = await res.json();
      if (res.ok) {
        if (data.api_key_configured) {
          statusTag.className = "status-badge live";
          statusTag.innerHTML = `<span class="status-dot"></span> Live Crawler Active`;
        } else {
          statusTag.className = "status-badge demo";
          statusTag.innerHTML = `<span class="status-dot warning-dot"></span> High-Fidelity Demo Mode`;
        }
      }
    } catch (e) {
      console.warn("Could not check live status, using offline styling.");
    }
  }
  
  // --- Initialize Segmented Control ---
  segmentBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      segmentBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      segmentedControl.setAttribute("data-active", index);
      activeLevel = btn.getAttribute("data-level");
    });
  });
  
  // --- Initialize Workspace Navbar Tabs ---
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const targetTab = btn.getAttribute("data-tab");
      tabContents.forEach(content => {
        if (content.id === targetTab) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });

  // --- Loader Simulation Helpers ---
  let statusInterval = null;
  const loadingStages = [
    "Spinning up social crawler nodes...",
    "Crawling Reddit discussions & reviews...",
    "Extracting X (Twitter) sentiment logs...",
    "Combining social timeline consensus...",
    "Configuring dynamic synthesis prompts...",
    "Executing anti-hallucination guardrails...",
    "Formulating Simplified & Expert reports...",
    "Polishing Shandar Mobiles dashboard..."
  ];

  function startLoaderAnimation() {
    loader.style.display = "flex";
    let stage = 0;
    loaderStatus.textContent = loadingStages[0];
    
    statusInterval = setInterval(() => {
      stage = (stage + 1) % loadingStages.length;
      loaderStatus.textContent = loadingStages[stage];
    }, 2000);
  }

  function stopLoaderAnimation() {
    clearInterval(statusInterval);
    loader.style.display = "none";
  }

  // --- Simple client-side Markdown parser ---
  function parseMarkdown(md) {
    if (!md) return "";
    
    let html = md;
    
    // Clean escape entities
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Convert Headers (h1, h2, h3, h4)
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
    
    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, "<blockquote><p>$1</p></blockquote>");
    
    // Bullet Points (- and * with ul wrappers)
    html = html.replace(/^\- (.*?)$/gm, "<li>$1</li>");
    html = html.replace(/^\* (.*?)$/gm, "<li>$1</li>");
    
    // Bold & Strong
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Code blocks & inline code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");
    
    // Line breaks
    html = html.replace(/\n/g, "<br>");
    
    // Fix continuous list tags by wrapping them in <ul>
    html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
    
    // Clean up empty paragraphs/spaces
    html = html.replace(/<br><br>/g, "<br>");
    
    return html;
  }

  // --- Render Unified Combined Social Media Feed ---
  function renderSocialFeeds(redditFeed, xFeed) {
    // 1. Tag platforms
    const formattedReddit = (redditFeed || []).map(post => ({
      ...post,
      platform: "reddit",
      score: post.upvotes || 0
    }));
    
    const formattedX = (xFeed || []).map(tweet => ({
      ...tweet,
      platform: "x",
      score: tweet.likes || 0
    }));
    
    // 2. Combine and sort by score descending
    const combinedFeed = [...formattedReddit, ...formattedX].sort((a, b) => b.score - a.score);
    
    if (combinedFeed.length === 0) {
      socialFeedList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💬</div>
          <h3>No social posts captured</h3>
          <p>Run a search analysis to pull real-time reviews from X and Reddit.</p>
        </div>`;
      return;
    }

    // 3. Render unified timeline
    socialFeedList.innerHTML = combinedFeed.map(item => {
      const dateStr = "Recently Crawled";
      
      if (item.platform === "reddit") {
        const bodyContent = item.body ? item.body.replace(/\n/g, "<br>") : "";
        return `
          <div class="social-card">
            <div class="social-card-meta">
              <div class="user-profile">
                <div class="profile-avatar">${item.author ? item.author.substring(0,2).toUpperCase() : "U"}</div>
                <div>
                  <span class="user-name">u/${item.author || "anonymous"}</span>
                  <div style="font-size:10px; color:var(--text-muted)">r/${item.community || "smartphones"}</div>
                </div>
              </div>
              <span class="platform-badge reddit">Reddit</span>
            </div>
            <h4 class="social-card-title">${item.title || ""}</h4>
            ${bodyContent ? `<p class="social-card-body">${bodyContent}</p>` : ""}
            <div class="social-card-footer">
              <div class="footer-stat"><span class="icon">⬆️</span> ${item.upvotes || 0} Upvotes</div>
              <div class="footer-stat"><span class="icon">💬</span> ${item.comments || 0} Comments</div>
              <div class="footer-stat">${dateStr}</div>
            </div>
          </div>`;
      } else {
        const bodyContent = item.body ? item.body.replace(/\n/g, "<br>") : "";
        return `
          <div class="social-card">
            <div class="social-card-meta">
              <div class="user-profile">
                <div class="profile-avatar x-avatar">𝕏</div>
                <div>
                  <span class="user-name">@${item.author || "twitter_user"}</span>
                  <div style="font-size:10px; color:var(--text-muted)">Verified Tech Opinion</div>
                </div>
              </div>
              <span class="platform-badge x">𝕏 Feed</span>
            </div>
            <p class="social-card-body" style="font-size:14px; color:white; font-weight: 500;">${bodyContent}</p>
            <div class="social-card-footer">
              <div class="footer-stat"><span class="icon">❤️</span> ${item.likes || 0} Likes</div>
              <div class="footer-stat"><span class="icon">🔁</span> ${item.retweets || 0} Retweets</div>
              <div class="footer-stat">${dateStr}</div>
            </div>
          </div>`;
      }
    }).join("");
  }

  // --- Fetch and Display Single Report ---
  async function loadReportDetails(reportId) {
    startLoaderAnimation();
    shareBox.style.display = "none";
    try {
      const res = await fetch(`/reports/${reportId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to load report archives.");
      
      currentReportId = data.id;
      currentReportContent = data.report;
      
      // Update headings
      reportTitleText.textContent = data.product;
      const formattedDate = data.created_at ? new Date(data.created_at).toLocaleString() : "Archived Date";
      reportMetaRow.textContent = `Archive #${data.id} • Mode: ${data.level.toUpperCase()} • Cached: ${formattedDate}`;
      
      // Parse markdown report
      reportMarkdown.innerHTML = parseMarkdown(data.report);
      
      // Toggle back to main report tab
      document.querySelector('[data-tab="report-tab"]').click();
      
      // Enable Action Buttons
      btnCopy.disabled = false;
      btnShare.disabled = false;
      
      // Check if we also have cached feeds to load
      const searchRes = await fetch(`/analyze?product=${encodeURIComponent(data.product)}&level=${encodeURIComponent(data.level)}`);
      const searchData = await searchRes.json();
      if (searchRes.ok) {
        renderSocialFeeds(searchData.reddit_feed, searchData.x_feed);
      } else {
        renderSocialFeeds([], []);
      }
      
    } catch (err) {
      reportMarkdown.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Error loading archive</h3>
          <p>${err.message}</p>
        </div>`;
    } finally {
      stopLoaderAnimation();
    }
  }

  // --- Fetch Archive List ---
  async function fetchArchives() {
    try {
      const res = await fetch("/reports?limit=15");
      const data = await res.json();
      if (!res.ok) throw new Error("Could not fetch reports.");
      
      if (!data.reports || data.reports.length === 0) {
        recentList.innerHTML = `<div class="meta-info text-center">No reports compiled yet.</div>`;
        return;
      }
      
      recentList.innerHTML = data.reports.map(r => {
        const itemDate = r.created_at ? new Date(r.created_at).toLocaleDateString() : "Saved";
        const levelName = r.level === "simplified" ? "simplified" : "expert";
        return `
          <div class="recent-item" data-id="${r.id}">
            <div class="recent-item-info">
              <span class="recent-item-title">${r.product}</span>
              <span class="recent-item-meta">Archive #${r.id} • ${itemDate}</span>
            </div>
            <span class="recent-item-badge expert" style="background: ${r.level === 'simplified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${r.level === 'simplified' ? 'var(--color-easy)' : 'var(--color-expert)'}; border: 1px solid ${r.level === 'simplified' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};">${levelName}</span>
          </div>`;
      }).join("");
      
      // Add Click Listeners to items
      document.querySelectorAll(".recent-item").forEach(item => {
        item.addEventListener("click", () => {
          const reportId = item.getAttribute("data-id");
          loadReportDetails(reportId);
        });
      });
      
    } catch (err) {
      recentList.innerHTML = `<div class="meta-info text-center" style="color:var(--color-expert)">Failed to load archives.</div>`;
    }
  }

  // --- Intercept Form Submission ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = productInput.value.trim();
    if (!product) return;
    
    startLoaderAnimation();
    shareBox.style.display = "none";
    searchBtn.disabled = true;
    
    try {
      const res = await fetch(`/analyze?product=${encodeURIComponent(product)}&level=${encodeURIComponent(activeLevel)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Multi-agent crawl pipeline collapsed.");
      
      currentReportId = data.report_id;
      currentReportContent = data.report;
      
      // Update UI headings
      reportTitleText.textContent = data.product;
      reportMetaRow.textContent = `Report #${data.report_id} • Target: ${data.level.toUpperCase()} • Generated Live Now`;
      
      // Parse & display report
      reportMarkdown.innerHTML = parseMarkdown(data.report);
      
      // Render unified feed
      renderSocialFeeds(data.reddit_feed, data.x_feed);
      
      // Switch back to core report tab
      document.querySelector('[data-tab="report-tab"]').click();
      
      // Enable actions
      btnCopy.disabled = false;
      btnShare.disabled = false;
      
      // Refresh archives list
      await fetchArchives();
      
    } catch (err) {
      reportMarkdown.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Pipeline Execution Error</h3>
          <p>${err.message}</p>
          <p style="margin-top: 10px; font-size:12px; color:var(--text-muted)">Verify your internet connection and environment settings.</p>
        </div>`;
    } finally {
      stopLoaderAnimation();
      searchBtn.disabled = false;
    }
  });

  // --- Share Button Logic ---
  btnShare.addEventListener("click", async () => {
    if (!currentReportId) return;
    shareUrlText.textContent = "Negotiating secure link...";
    shareBox.style.display = "flex";
    
    try {
      const res = await fetch(`/share?report_id=${encodeURIComponent(currentReportId)}`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Share link negotiation failed.");
      
      const shareUrl = new URL(data.url, window.location.origin).toString();
      shareUrlText.innerHTML = `<a href="${shareUrl}" target="_blank" rel="noreferrer">${shareUrl}</a>`;
    } catch (e) {
      shareUrlText.textContent = "Error: " + e.message;
    }
  });

  // --- Copy Clipboard Logic ---
  btnCopy.addEventListener("click", async () => {
    if (!currentReportContent) return;
    try {
      await navigator.clipboard.writeText(currentReportContent);
      const originalText = btnCopy.innerHTML;
      btnCopy.innerHTML = "<span>✅ Copied!</span>";
      setTimeout(() => {
        btnCopy.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      alert("Browser blocked clipboard access. Try manual highlighting.");
    }
  });

  // --- Apify Monitor Dashboard Logic ---
  
  const apifyRunStatus = document.getElementById("apify-run-status");
  const apifyRunDuration = document.getElementById("apify-run-duration");
  const apifyRunBuild = document.getElementById("apify-run-build");
  const btnApifyResurrect = document.getElementById("btn-apify-resurrect");
  
  const apifyInputQueries = document.getElementById("apify-input-queries");
  const apifyInputPosts = document.getElementById("apify-input-posts");
  const btnApifySaveInput = document.getElementById("btn-apify-save-input");
  
  const sandboxMethod = document.getElementById("sandbox-method");
  const sandboxUrl = document.getElementById("sandbox-url");
  const sandboxJsonOutput = document.getElementById("sandbox-json-output");
  const btnExecuteSandbox = document.getElementById("btn-execute-sandbox");
  const sandboxPillBtns = document.querySelectorAll(".sandbox-pill-btn");
  
  let activeSandboxEndpoint = "/api/apify/run";
  let activeSandboxMethod = "GET";
  
  // 1. Fetch & Update Apify Status View
  async function refreshApifyStatus() {
    apifyRunStatus.className = "status-pill status-loading";
    apifyRunStatus.textContent = "Checking...";
    
    try {
      const res = await fetch("/api/apify/run");
      const data = await res.json();
      if (res.ok) {
        const runData = data.data || data;
        const status = runData.status || "UNKNOWN";
        
        apifyRunStatus.textContent = status;
        apifyRunStatus.className = `status-pill status-${status.toLowerCase()}`;
        
        // Duration
        if (runData.startedAt && runData.finishedAt) {
          const start = new Date(runData.startedAt);
          const end = new Date(runData.finishedAt);
          const diffSec = Math.round((end - start) / 1000);
          apifyRunDuration.textContent = `${diffSec} seconds`;
        } else if (runData.startedAt) {
          const start = new Date(runData.startedAt);
          const diffSec = Math.round((new Date() - start) / 1000);
          apifyRunDuration.textContent = `${diffSec}s (Running)`;
        } else {
          apifyRunDuration.textContent = "-";
        }
        
        // Build
        apifyRunBuild.textContent = runData.buildNumber || runData.actorId || "-";
      } else {
        apifyRunStatus.textContent = "ERROR";
        apifyRunStatus.className = "status-pill status-failed";
      }
    } catch (e) {
      apifyRunStatus.textContent = "OFFLINE";
      apifyRunStatus.className = "status-pill status-failed";
    }
  }
  
  // 2. Fetch & Update Input Configurations
  async function refreshApifyInput() {
    try {
      const res = await fetch("/api/apify/input");
      if (res.ok) {
        const data = await res.json();
        if (data.queries && Array.isArray(data.queries)) {
          apifyInputQueries.value = data.queries.join(", ");
        }
        if (data.maxPosts) {
          apifyInputPosts.value = data.maxPosts;
        }
      }
    } catch (e) {
      console.warn("Could not retrieve active Apify input store.");
    }
  }
  
  // Listen for Tab Clicks to Refresh Apify Status dynamically
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.getAttribute("data-tab") === "apify-tab") {
        refreshApifyStatus();
        refreshApifyInput();
      }
    });
  });
  
  // 3. Resurrect Run click
  btnApifyResurrect.addEventListener("click", async () => {
    const originalText = btnApifyResurrect.innerHTML;
    btnApifyResurrect.disabled = true;
    btnApifyResurrect.innerHTML = "<span>🔄 Resurrecting...</span>";
    
    try {
      const res = await fetch("/api/apify/resurrect", { method: "POST" });
      const data = await res.json();
      
      sandboxJsonOutput.textContent = JSON.stringify(data, null, 2);
      
      if (res.ok) {
        apifyRunStatus.textContent = "RUNNING";
        apifyRunStatus.className = "status-pill status-running";
        
        // Quick Success animation
        btnApifyResurrect.innerHTML = "<span>✅ Resurrected Successfully!</span>";
        setTimeout(() => {
          btnApifyResurrect.innerHTML = originalText;
          btnApifyResurrect.disabled = false;
          refreshApifyStatus();
        }, 2500);
      } else {
        btnApifyResurrect.innerHTML = "<span>❌ Resurrect Failed</span>";
        setTimeout(() => {
          btnApifyResurrect.innerHTML = originalText;
          btnApifyResurrect.disabled = false;
        }, 2000);
      }
    } catch (e) {
      btnApifyResurrect.innerHTML = "<span>❌ Connection Error</span>";
      setTimeout(() => {
        btnApifyResurrect.innerHTML = originalText;
        btnApifyResurrect.disabled = false;
      }, 2000);
    }
  });
  
  // 4. Save/Update Input Config click
  btnApifySaveInput.addEventListener("click", async () => {
    const originalText = btnApifySaveInput.innerHTML;
    btnApifySaveInput.disabled = true;
    btnApifySaveInput.innerHTML = "<span>💾 Saving Configurations...</span>";
    
    const rawQueries = apifyInputQueries.value.split(",").map(q => q.trim()).filter(q => q !== "");
    const maxPosts = parseInt(apifyInputPosts.value) || 5;
    
    const payload = {
      content_analysis: false,
      forceSortNewForTimeFilteredRuns: false,
      includeNsfw: false,
      maxComments: 10,
      maxPosts: maxPosts,
      maximize_coverage: false,
      queries: rawQueries,
      scrapeComments: false,
      sentiment_analysis: false,
      strictSearch: false,
      strictTokenFilter: false,
      sort: "relevance",
      timeframe: "all",
      subredditSort: "relevance",
      subredditTimeframe: "all"
    };
    
    try {
      const res = await fetch("/api/apify/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      sandboxJsonOutput.textContent = JSON.stringify(data, null, 2);
      
      if (res.ok) {
        btnApifySaveInput.innerHTML = "<span>✅ Parameters Configured!</span>";
        setTimeout(() => {
          btnApifySaveInput.innerHTML = originalText;
          btnApifySaveInput.disabled = false;
          refreshApifyInput();
        }, 2000);
      } else {
        btnApifySaveInput.innerHTML = "<span>❌ Save Failed</span>";
        setTimeout(() => {
          btnApifySaveInput.innerHTML = originalText;
          btnApifySaveInput.disabled = false;
        }, 2000);
      }
    } catch (e) {
      btnApifySaveInput.innerHTML = "<span>❌ Connection Error</span>";
      setTimeout(() => {
        btnApifySaveInput.innerHTML = originalText;
        btnApifySaveInput.disabled = false;
      }, 2000);
    }
  });
  
  // 5. Sandbox Console Pill Clicks
  sandboxPillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sandboxPillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      activeSandboxEndpoint = btn.getAttribute("data-endpoint");
      activeSandboxMethod = btn.getAttribute("data-method");
      
      sandboxMethod.textContent = activeSandboxMethod;
      sandboxMethod.className = `method-tag ${activeSandboxMethod}`;
      sandboxUrl.textContent = activeSandboxEndpoint;
    });
  });
  
  // 6. Execute Sandbox Endpoint click
  btnExecuteSandbox.addEventListener("click", async () => {
    const originalText = btnExecuteSandbox.textContent;
    btnExecuteSandbox.disabled = true;
    btnExecuteSandbox.textContent = "Executing...";
    sandboxJsonOutput.textContent = "/* Calling endpoint: " + activeSandboxEndpoint + " ... */";
    
    try {
      let res;
      if (activeSandboxMethod === "POST") {
        res = await fetch(activeSandboxEndpoint, { method: "POST" });
      } else {
        // GET dataset or status
        let queryParams = "";
        if (activeSandboxEndpoint === "/api/apify/dataset") {
          queryParams = "?limit=5"; // Limit sandbox display records
        }
        res = await fetch(activeSandboxEndpoint + queryParams);
      }
      
      const data = await res.json();
      sandboxJsonOutput.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      sandboxJsonOutput.textContent = JSON.stringify({ error: e.message }, null, 2);
    } finally {
      btnExecuteSandbox.disabled = false;
      btnExecuteSandbox.textContent = originalText;
    }
  });

  // --- Initial Load ---
  checkServerStatus();
  fetchArchives();
});

