#include <bits/stdc++.h>
using namespace std;

struct Move { int r1,c1,r2,c2; };
struct Board {
    int n,m;
    set<pair<pair<int,int>,pair<int,int>>> lines;
    map<pair<int,int>, char> boxes; // stores 'A' or 'P'
};

// Return available moves
vector<Move> getAvailableMoves(Board &board){
    vector<Move> moves;
    for(int r=0;r<board.n;r++){
        for(int c=0;c<board.m;c++){
            if(r+1<board.n){
                Move m={r,c,r+1,c};
                if(!board.lines.count({{r,c},{r+1,c}})) moves.push_back(m);
            }
            if(c+1<board.m){
                Move m={r,c,r,c+1};
                if(!board.lines.count({{r,c},{r,c+1}})) moves.push_back(m);
            }
        }
    }
    return moves;
}

// Count boxes gained by this move
int countBoxesGained(Board &board, Move m, char player){
    Board tmp = board;
    tmp.lines.insert({{m.r1,m.c1},{m.r2,m.c2}});
    int gained = 0;
    for(int r=0;r<board.n-1;r++){
        for(int c=0;c<board.m-1;c++){
            pair<int,int> key={r,c};
            if(tmp.boxes.count(key)) continue;
            int sides=0;
            sides += tmp.lines.count({{r,c},{r,c+1}})||tmp.lines.count({{r,c+1},{r,c}});
            sides += tmp.lines.count({{r+1,c},{r+1,c+1}})||tmp.lines.count({{r+1,c+1},{r+1,c}});
            sides += tmp.lines.count({{r,c},{r+1,c}})||tmp.lines.count({{r+1,c},{r,c}});
            sides += tmp.lines.count({{r,c+1},{r+1,c+1}})||tmp.lines.count({{r+1,c+1},{r,c+1}});
            if(sides==4){ gained++; tmp.boxes[key]=player; }
        }
    }
    return gained;
}

// Evaluate board: AI boxes - Player boxes
int evaluate(Board &board){
    int ai=0,player=0;
    for(auto &b:board.boxes){
        if(b.second=='A') ai++;
        else player++;
    }
    return ai-player;
}

// Minimax with depth
pair<int, Move> minimax(Board board,int depth,bool isAI){
    auto moves = getAvailableMoves(board);
    if(depth==0 || moves.empty()) return make_pair(evaluate(board), Move{-1,-1,-1,-1});
    
    int bestScore = isAI ? INT_MIN : INT_MAX;
    Move bestMove = {-1,-1,-1,-1};

    for(auto m:moves){
        Board copy = board;
        copy.lines.insert({{m.r1,m.c1},{m.r2,m.c2}});
        int boxesGained = countBoxesGained(copy, m, isAI?'A':'P');
        bool extraTurn = boxesGained>0;
        pair<int,Move> result = minimax(copy, depth-1, isAI? !extraTurn : extraTurn);
        int score = result.first;

        if(isAI && score>bestScore){ bestScore=score; bestMove=m;}
        if(!isAI && score<bestScore){ bestScore=score; bestMove=m;}
    }
    return make_pair(bestScore,bestMove);
}

int main(){
    int n,m;
    cin>>n>>m;
    int linesCount;
    cin>>linesCount;
    Board board{n,m};
    for(int i=0;i<linesCount;i++){
        int r1,c1,r2,c2;
        cin>>r1>>c1>>r2>>c2;
        board.lines.insert({{r1,c1},{r2,c2}});
    }
    pair<int,Move> result = minimax(board,4,true); // depth 4
    Move bestMove = result.second;
    cout<<bestMove.r1<<" "<<bestMove.c1<<" "<<bestMove.r2<<" "<<bestMove.c2<<endl;
    return 0;
}
