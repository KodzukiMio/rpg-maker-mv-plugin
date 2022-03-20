#include <SZN_FUC.H>
using namespace std;
int main(int args1, char** args2) {
	hash<string>hash_;
	vector<string>files;
	KUR::getFiles(*(args2 + 1), files);
	string RES = "";
	for (int i = 0; i < files.size(); i++) {
		auto res = KUR::FastRead_N(files[i].c_str());
		files[i].assign(files[i], files[i].find("www"));
		files[i] += "$$$";
		files[i] += to_string(hash_(*res));
		delete res;
		RES += files[i] + "\n";
	};
	KUR::KMiscellaneous::SaveData("HASH.data", *KUR::KMiscellaneous::encryption("HASH", KUR::ToWstring_(RES)));
	return 0;
};
