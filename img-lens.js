;(function(lensW, lensH){
    let currImage = null;

    // Use the height the same as the width if not provided
    if(!lensH){
        lensH = lensW;
    }

    // Create lens element
    const lens = document.createElement('div');
    lens.style.width = `${lensW}px`;
    lens.style.height = `${lensH}px`;
    lens.style.backgroundRepeat = 'no-repeat';
    lens.classList.add('lens');
    document.body.appendChild(lens);

    // Check if a given point is within an element bounding rectangle
    const pointWithin = (elem, x, y) => {
        const bcr = elem.getBoundingClientRect();

        return x >= bcr.left && x <= bcr.right && y >= bcr.top && y <= bcr.bottom;
    }

    // Update currently viewed image and apply it to the lens background image
    const updateImage = e => {
        currImage = e.target;
        lens.style.backgroundImage = `url(${currImage.src}`;
    }

    // Show the lens
    const showLens = () => {
        lens.classList.add('show');
    }

    // Hide the lens
    const hideLens = () => {
        lens.classList.remove('show');
    }

    // Handling mouse movement
    const moveLens = (e) => {
        // Get the cursor position relative to the viewport
        const curX = e.x;
        const curY = e.y;

        // Adjust the center of the lens to the cursor position
        lens.style.left = `${curX - lensW / 2}px`;
        lens.style.top = `${curY - lensH / 2}px`;

        if(currImage !== null){
            const isCursorWithin = pointWithin(currImage, curX, curY);

            // Hide the lens when it exceeds the current image boundaries
            if(lens.classList.contains('show') && !isCursorWithin){
                hideLens();
                // Exit here, No need to perform unnecessary calculations
                return;
            }else if(!lens.classList.contains('show') && isCursorWithin){
                showLens();
            }

            // Calculating width and height zoom factors between the displayed image size and the actual image size
            const wzf = currImage.naturalWidth / currImage.width;
            const hzf = currImage.naturalHeight / currImage.height;
            
            // Calculate background position according to actual image size
            const bcr = currImage.getBoundingClientRect();
            const posX = Math.round((curX - bcr.left) * wzf - lensW / 2);
            const posY = Math.round((curY - bcr.top) * hzf - lensH / 2);
    
            lens.style.backgroundPosition = `${-posX}px ${-posY}px`;
        }
    }

    // Find images with use-lens attribute
    const images = document.querySelectorAll('img[use-lens]');

    images.forEach(img => {
        img.addEventListener('mouseenter', updateImage);
    });

    // Add mouseover event listener on found images
    document.addEventListener('mousemove', moveLens);
    lens.addEventListener('mousemove', moveLens);

})(150, 150);