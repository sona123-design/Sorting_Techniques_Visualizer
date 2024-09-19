const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm-select');
const generateArrayBtn = document.getElementById('generate-array');
const startSortingBtn = document.getElementById('start-sorting');
const arraySizeSlider = document.getElementById('array-size');
const sortingSpeedSlider = document.getElementById('sorting-speed');

let array = [];
let arrayBars = [];
let isSorting = false;

function generateArray() {
    array = [];
    arrayContainer.innerHTML = '';
    const arraySize = arraySizeSlider.value;
    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        array.push(value);
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 3}px`;
        bar.setAttribute('data-value', value);
        arrayContainer.appendChild(bar);
    }
    arrayBars = document.querySelectorAll('.array-bar');
    updateBarColors();
}

function updateBarColors() {
    arrayBars.forEach((bar, index) => {
        const hue = (index / arrayBars.length) * 360;
        bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            await swap(j, j + 1);
            j--;
        }
        array[j + 1] = key;
        arrayBars[j + 1].style.height = `${key * 3}px`;
        arrayBars[j + 1].setAttribute('data-value', key);
        updateBarColors();
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
    }
}

async function heapSort() {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await swap(i, largest);
        await heapify(n, largest);
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }

    await swap(i + 1, high);
    return i + 1;
}

async function mergeSort(left = 0, right = array.length - 1) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        arrayBars[k].style.height = `${array[k] * 3}px`;
        arrayBars[k].setAttribute('data-value', array[k]);
        updateBarColors();
        await sleep(100 - sortingSpeedSlider.value);
        k++;
    }

    while (i < leftArray.length) {
        array[k] = leftArray[i];
        arrayBars[k].style.height = `${array[k] * 3}px`;
        arrayBars[k].setAttribute('data-value',array[k]);
        updateBarColors();
        await sleep(100 - sortingSpeedSlider.value);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        array[k] = rightArray[j];
        arrayBars[k].style.height = `${array[k] * 3}px`;
        arrayBars[k].setAttribute('data-value', array[k]);
        updateBarColors();
        await sleep(100 - sortingSpeedSlider.value);
        j++;
        k++;
    }
}

async function swap(i, j) {
    await sleep(100 - sortingSpeedSlider.value);
    [array[i], array[j]] = [array[j], array[i]];
    arrayBars[i].style.height = `${array[i] * 3}px`;
    arrayBars[j].style.height = `${array[j] * 3}px`;
    arrayBars[i].setAttribute('data-value', array[i]);
    arrayBars[j].setAttribute('data-value', array[j]);
    updateBarColors();
}

async function startSorting() {
    if (isSorting) return;
    isSorting = true;
    startSortingBtn.disabled = true;
    generateArrayBtn.disabled = true;
    algorithmSelect.disabled = true;

    const selectedAlgorithm = algorithmSelect.value;
    switch (selectedAlgorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'heap':
            await heapSort();
            break;
        case 'quick':
            await quickSort();
            break;
        case 'merge':
            await mergeSort();
            break;
    }

    isSorting = false;
    startSortingBtn.disabled = false;
    generateArrayBtn.disabled = false;
    algorithmSelect.disabled = false;
}

generateArrayBtn.addEventListener('click', generateArray);
startSortingBtn.addEventListener('click', startSorting);
arraySizeSlider.addEventListener('input', generateArray);

generateArray();