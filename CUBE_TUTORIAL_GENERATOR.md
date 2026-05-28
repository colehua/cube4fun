# Cube4Fun Web Tutorial Generator - Standard Operating Procedure (SOP)

**Target Audience:** AI Agents / LLMs (like Gemini CLI).
**Purpose:** This document is the exact, end-to-end workflow to convert a user-provided Rubik's Cube `.pptx` presentation into a fully semantic, responsive HTML tutorial for the `cube4fun` website. 

When the user provides a new tutorial, they will provide BOTH a `.pptx` file and an exported `.pdf` file. You must autonomously execute the following steps without requiring step-by-step guidance.

---

## Step 1: Workspace Setup & PPTX Extraction
PowerPoint files (`.pptx`) are ZIP archives containing XML and media.
1. Copy the provided `.pptx` file into the local git repository clone. 
2. Rename the `.pptx` extension to `.zip` in a temporary working directory and extract it.
   - You will need the directories: `ppt/slides/`, `ppt/media/`, and `ppt/slides/_rels/`.

## Step 2: Media Handling & FFmpeg
Browsers require standard web formats. The PPTX often contains `.MOV` files.
1. Create/ensure a `media/` folder exists in the website's root directory.
2. Copy all files from the extracted `ppt/media/` folder into the website's `media/` folder.
3. **Mandatory Video Conversion:** Use `ffmpeg` to convert ALL `.MOV` files to `.mp4` format using `libx264` and `aac` codecs. 
4. Delete the original `.MOV` files from the website's `media/` folder after successful conversion.

## Step 3: Raw Semantic Data Extraction (JSON Dump)
1. Write a Python script to parse `slide*.xml` and their corresponding `_rels/*.rels` files.
2. Extract the text, media filenames (changing `.MOV` to `.mp4`), and the `x`/`y` coordinates.
3. Dump this data into a temporary `slides_dump.json`.

## Step 4: Intelligent LLM Semantic Layout (Core Task)
**You (the LLM) must now read the provided `.pdf` file visually (or via OCR) to understand the TRUE layout, logic, and grouping. DO NOT rely blindly on the JSON coordinates.**
1. **Analyze PDF Context:** Use the `.pdf` to see which text belongs to which image/video. If you see "Case 1", "Case 2", group them into a `<div class="grid-4">`. If you see an algorithm paired with a video, group them tightly inside a `<div class="card">`.
2. **Grammar & Proofreading:** While transcribing the text from the slides to HTML, you MUST fix minor grammar mistakes automatically (e.g., fixing "peace" to "piece", adding missing "is" or "that", correcting awkward phrasing like "most easy" to "easiest"). Do not change the core meaning, just polish the English.
3. **Keep the Cute Vibe:** Inject relevant, cute emojis into the headings or text blocks (e.g., 🌼, 🧩, 🧠, 🍔, 🎉) to maintain the fun, kid-friendly design.
4. **Mobile Video Thumbnails:** You MUST append `#t=0.001` to the end of EVERY `<video>` source URL (e.g., `src="./media/media1.mp4#t=0.001"`). This forces mobile browsers (like Chrome on Android/iOS) to fetch the first frame and display a thumbnail instead of a grey box.
5. **Handle Arrows:** If an image is just a small directional arrow, apply the `.arrow-icon` CSS class to remove borders and shadows.
6. **Generate HTML:** Write a `build_semantic_html.py` script to generate the final `tutorial-{type}.html` using the established CSS theme (variables `--cyan-blob`, `--yellow-blob`, fonts `DynaPuff`, `Comic Neue`).

## Step 5: PPTX File Size Check & Header Buttons
Provide buttons at the top of the `tutorial-{type}.html` page so users can access the original presentation.
1. **Check File Size:** Check the exact file size of the original `.pptx` file.
2. **If File Size is < 100MB:**
   - Include **BOTH** a Live Viewer button AND a Download button:
     ```html
     <div style="text-align: center; margin-bottom: 30px; display: flex; gap: 15px; justify-content: center;">
         <a href="https://view.officeapps.live.com/op/view.aspx?src=https://colehua.github.io/cube4fun/how-to-solve-{type}.pptx" target="_blank" style="...">📊 View Original PowerPoint (in Browser)</a>
         <a href="https://github.com/colehua/cube4fun/raw/main/how-to-solve-{type}.pptx" download style="...">⬇️ Download Original PowerPoint</a>
     </div>
     ```
3. **If File Size is >= 100MB:**
   - The Microsoft Office Viewer will fail. Include **ONLY** the Download button:
     ```html
     <div style="text-align: center; margin-bottom: 30px;">
         <a href="https://github.com/colehua/cube4fun/raw/main/how-to-solve-{type}.pptx" download style="...">⬇️ Download Original PowerPoint</a>
     </div>
     ```

## Step 6: Git LFS (Large File Storage)
PowerPoint files with embedded videos frequently exceed standard Git limits.
1. Run `git lfs install` (if not already installed).
2. Run `git lfs track "*.pptx"`.
3. Ensure `.gitattributes` is added and committed alongside the `.pptx` file.

## Step 7: Update Homepage (`index.html`)
The new tutorial must be linked from the homepage.
1. Open `index.html` and locate the `<div class="cube-button">` placeholders.
2. Find the placeholder matching the new cube type (e.g., `2x2 Tutorial (Soon)`).
3. **Unlock It:** 
   - Change the `href` to point to `tutorial-{type}.html`.
   - Remove `cursor: not-allowed;` and the `onclick="alert('Coming soon!'); return false;"` attribute.
   - Change the background color from `#ccc` to a fun theme color (e.g., `#FF6B6B`, `#4ECDC4`, or `#FFD93D`).
   - Change the emoji from `🔒` to `🧊` and re-enable the `.cube-icon` CSS class if needed.
   - Remove the "(Soon)" text.

## Step 8: Finalize & Push
1. Add all new files (`.html`, `.mp4`, `.jpeg`/`.png`, `.pptx`, `.gitattributes`, `index.html`).
2. Commit with a descriptive message (e.g., `"Add {type} tutorial, update homepage, track PPTX via LFS"`).
3. Push to the `main` branch: `git push origin main`.
4. Clean up all temporary python scripts, zip files, and JSON dumps from the workspace.