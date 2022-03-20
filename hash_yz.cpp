#define Windows_ENABLE_KURZER
#include <SZN_FUC.H>
using namespace std;
int main(int args1, char** args2) {
	cout << "资源验证中...";
	hash<string>hash_;
	auto RES = KUR::FastRead_N("HASH.data");
	auto ws = KUR::KMiscellaneous::decrypt("HASH", *RES);
	delete RES;
	string str = KUR::ToString_(*ws);
	delete ws;
	auto dec = KUR::split(str, "\n");
	for (size_t i = 0; i < dec.size(); i++) {
		auto res = KUR::split(dec[i], "$$$");
		string* s = KUR::FastRead_N(res[0].c_str());
		if (to_string(hash_(*s)) == res[1]) { continue; }
		else { MessageBox(NULL, TEXT("资源受损,请重新下载安装本游戏."), TEXT("错误!!!"), MB_YESNO | MB_ICONQUESTION); return 0; };
	};
	cout << "启动游戏...";
	system("C:\\Users\\Administrator\\Desktop\\CFL2\\Game.exe");
	return 0;
};
