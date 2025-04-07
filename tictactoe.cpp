// save as tictactoe.cpp
#include <iostream>
#include <string>
using namespace std;

char winner(const string &board) {
    string winComb[] = {"012", "345", "678", "036", "147", "258", "048", "246"};
    for (string w : winComb) {
        if (board[w[0] - '0'] != ' ' &&
            board[w[0] - '0'] == board[w[1] - '0'] &&
            board[w[1] - '0'] == board[w[2] - '0'])
            return board[w[0] - '0'];
    }
    return ' ';
}

int bestMove(string board) {
    for (int i = 0; i < 9; ++i) {
        if (board[i] == ' ') {
            board[i] = 'O';
            if (winner(board) == 'O') return i;
            board[i] = ' ';
        }
    }
    for (int i = 0; i < 9; ++i) {
        if (board[i] == ' ') {
            board[i] = 'X';
            if (winner(board) == 'X') return i;
            board[i] = ' ';
        }
    }
    for (int i = 0; i < 9; ++i) {
        if (board[i] == ' ') return i;
    }
    return -1;
}

int main(int argc, char* argv[]) {
    if (argc != 2 || string(argv[1]).size() != 9) {
        cout << "Invalid input. Provide 9 character board state (e.g., 'XOX  OX  ')\n";
        return 1;
    }

    string board(argv[1]);
    for (char &c : board) {
        if (c != 'X' && c != 'O') c = ' ';
    }

    int move = bestMove(board);
    if (move == -1) {
        cout << "Game Over\n";
        return 0;
    }

    board[move] = 'O';
    cout << "AI played at: " << move << endl;
    cout << "New Board: " << board << endl;

    return 0;
}
//  feel free to used this....  