var modal = document.getElementById('myModal');
var btn = document.getElementById('enter');
var name = document.getElementById('nameModal');
var mumberClick = document.getElementById('data-numbers');
var information = document.getElementById('information');
var chipItem = document.getElementsByClassName('.chip')
    
btn.onclick = function () {
    modal.style.display = "none";
    
    document.getElementById('data-name').innerHTML = document.forms['idform'].elements['nameModal'].value;
}


class Board {
    constructor({ boardSelector }) {
        this.board =
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                .sort(function () { return Math.random() - 0.5 })
                .reduceRight(
                    function (board, chip, idx) {
                        if (chip !== 0) {
                            board[chip] = new Chip({
                                place: idx,
                                number: chip
                            });
                        } else {
                            board[chip] = idx;
                        }

                        return board;
                    },
                    {}
                );
        this.boardElement = document.querySelector(boardSelector);
        this.fillBoard();

        this.tryToMoveListener = this.tryToMove.bind(this);
        this.boardElement.addEventListener('click', this.tryToMoveListener);
        this.steps = 0;

    }
    fillBoard() {
        const { boardElement, board } = this,
            movedChips = this.getMovedChips();

        console.log(movedChips);

        boardElement.append(
            ...Object
                .values(board)
                .map(function (chip) {
                    if (chip.render) {
                        return chip.render({
                            canMove: movedChips[chip.place]
                        });
                    }
                    return "";
                })
        )
    }
    getMovedChips() {
        const zeroPlace = this.board[0],
            top = zeroPlace - 4,
            bottom = zeroPlace + 4,
            left = zeroPlace - 1,
            right = zeroPlace + 1,
            zeroRow = Math.floor(zeroPlace / 4);

        return {
            [left]: left >= 0 && left <= 15 && zeroRow === Math.floor(left / 4),
            [right]: right >= 0 && right <= 15 && zeroRow === Math.floor(right / 4),
            [bottom]: bottom <= 15,
            [top]: top >= 0
        }
    }
    move(movedChip) {
        const zeroPlace = this.board[0],
            movedChips = this.getMovedChips();

        if (movedChip && movedChip.place >= 0 && movedChips[movedChip.place]) {
            this.board[0] = movedChip.place;
            movedChip.move(zeroPlace);
            this.render();
            this.isWin();
            this.steps++;
        }

    }

    tryToMove(event) {
        const movedElement = event.target.closest('.chip--moved')

        if (movedElement) {
            const elementNumber = movedElement.innerText,
                movedChip = this.board[elementNumber];
            $('#steps').html(+$('#steps').html() + 1);

            this.move(movedChip);
        }

    }
    render() {
        const movedChips = this.getMovedChips();
        Object
            .values(this.board)
            .forEach(function (chip) {
                if (chip.render) {
                    return chip.render({
                        canMove: movedChips[chip.place]
                    });
                }
                return "";
            })
    }
    isWin() {
        for (const number in this.board) {
            if (+number !== 0 && +number !== this.board[number].place + 1) {

                console.log('not win');
                return false;
            }
        }
        console.log('win', this.steps);
        const winGames = +window.localStorage.getItem('game15wins'),
            maxSteps = +(window.localStorage.game15MaxSteps || 0),
            averageSteps = +(window.localStorage.game15AvarageSteps || 0);

        $('#numberGame').html(+$('#numberGame').html() + 1);  //Numbers og game

        window.localStorage.setItem('game15wins', (winGames + 1).toString());
        window.localStorage.game15MaxSteps = Math.max(maxSteps, this.steps);
        window.localStorage.game15AvarageSteps = ((winGames * averageSteps + this.steps) / (winGames + 1)).toFixed(2);

        return true;
    }

    
}

class Chip {
    constructor({ place, number }) {
        this.place = place;
        this.number = number;
        this.element = this.createElement();
    }
    createElement() {
        const container = document.createElement('div'),
            textEl = document.createElement('span');


        container.classList.add('chip');
        textEl.classList.add('chip__text');

        textEl.innerText = this.number;

        container.append(textEl);


        return container;
    }
    render({ canMove }) {
        const { element, place } = this,
            x = place % 4,
            left = 25 * x,
            y = Math.floor(place / 4),
            top = 25 * y;

        element.style.top = `${top}%`;
        element.style.left = `${left}%`;

        if (canMove) {
            element.classList.add('chip--moved');

        } else {
            element.classList.remove('chip--moved');
        }

        return element;
    }
    move(newPlace) {
        this.place = newPlace;
    }
}



const board = new Board({
    boardSelector: '.board'
});

console.log(board);



