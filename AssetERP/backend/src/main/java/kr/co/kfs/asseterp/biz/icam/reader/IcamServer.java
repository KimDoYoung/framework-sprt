package kr.co.kfs.asseterp.biz.icam.reader;

/** AS-IS DatabaseFactoryICAM(운용 서버) / DatabaseFactoryICAM2(자문 서버) */
public enum IcamServer {
    ICAM("icam"),
    ICAM2("icam2");

    private final String dir;

    IcamServer(String dir) {
        this.dir = dir;
    }

    /** 시뮬레이터 CSV 하위 폴더 이름 */
    public String dir() {
        return dir;
    }
}
