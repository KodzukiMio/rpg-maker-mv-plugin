#define ENABLE_SZN_ALL
#include<SZN_DEF.H>
#include <stdio.h>
#include <stdlib.h>
#define MAX 1024
using namespace std;
void main_();
void R(const string res, const string res_);
const int St_len = 1024;
int main() {
	main_();
	system("pause");
}
void main_() {
	KUR::kurzer ku;
	cout << "使用说明:\n[1]:加载JSONOUT.js\n[2]:调用OutJsToJson();\n[3]:";
	cout << "将plugins.json放置在...\\js文件夹内.\n";
	string s = ku.getstr("\n输入index.html文件所在目录地址:");
	auto s_ = s + "\\js\\plugins.json";
	R(s_, s);
}
void R(const string res, const string res_) {
	cout << "读取中...\n";
	auto str = KUR_FILE::KFILE::FileReadAsString(res);
	string sub1 = "START:";
	string sub2 = ":FINAL";
	KUR::Kstring Ks = str.c_str();
	auto val = KUR::Stack<int>::SubLineAsString(Ks, sub1, sub2);
	cout << "完成!\n正在复制文件...";
	string s;
	string address = res_ + "\\js\\plugins\\";
	while (!val->isempty()) {
		s << *val;
		KUR_FILE::KFILE::FileCpoy(address + s + ".js", "out\\" + s + ".js");
	}
	cout << "\n完成!!\n文件已保存到" << "exe所在目录下的out文件夹内.\n";
};