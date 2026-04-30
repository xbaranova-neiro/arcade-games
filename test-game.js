// Test script to verify Circuit Racing game loads correctly
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('Navigating to game...');
    await page.goto('http://localhost:8765/circuit-racing.html');
    
    // Wait for page to load
    await page.waitForSelector('#game');
    
    // Take screenshot of start screen
    console.log('Taking screenshot of start screen...');
    await page.screenshot({ path: 'screenshot-start.png' });
    
    // Check if start overlay is visible
    const startOverlayVisible = await page.evaluate(() => {
        const overlay = document.getElementById('startOverlay');
        return overlay && overlay.classList.contains('visible');
    });
    console.log('Start overlay visible:', startOverlayVisible);
    
    // Check if canvas exists and has correct dimensions
    const canvasInfo = await page.evaluate(() => {
        const canvas = document.getElementById('game');
        return {
            exists: !!canvas,
            width: canvas?.width,
            height: canvas?.height
        };
    });
    console.log('Canvas info:', canvasInfo);
    
    // Click the START button
    console.log('Clicking START button...');
    await page.click('#btnStart');
    
    // Wait for countdown (5 seconds)
    console.log('Waiting for countdown...');
    await page.waitForTimeout(5000);
    
    // Take screenshot of racing gameplay
    console.log('Taking screenshot of gameplay...');
    await page.screenshot({ path: 'screenshot-gameplay.png' });
    
    // Check game state
    const gameState = await page.evaluate(() => {
        // Check if HUD elements are visible
        const canvas = document.getElementById('game');
        const ctx = canvas?.getContext('2d');
        
        return {
            canvasExists: !!canvas,
            contextExists: !!ctx,
            startOverlayHidden: !document.getElementById('startOverlay')?.classList.contains('visible'),
            finishOverlayHidden: !document.getElementById('finishOverlay')?.classList.contains('visible')
        };
    });
    
    console.log('Game state:', gameState);
    console.log('\nTest complete! Check screenshot-start.png and screenshot-gameplay.png');
    
    // Keep browser open for manual inspection
    console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
    await browser.close();
})();
