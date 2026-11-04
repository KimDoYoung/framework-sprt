package kr.co.kfs.asseterp.biz.batch.dto;

/**
 * 배치 호출 파라미터. AS-IS BatchMain이 request.getParameter로 읽던 이름을 그대로 쓴다.
 * 모두 선택이며 날짜 형식은 AS-IS와 같게 각 작업(BatchAction)이 해석한다.
 */
public record BatchReq(
        String companyId,
        String worker,
        String ifCode,
        String stdDate,
        String startDate,
        String closeDate,
        String sendDate,
        String year,
        String data
) {
}
