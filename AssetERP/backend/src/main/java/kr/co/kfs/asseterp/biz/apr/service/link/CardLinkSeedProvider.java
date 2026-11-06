package kr.co.kfs.asseterp.biz.apr.service.link;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Set;

/**
 * A41 이익제공(법인카드) (Apr01_Edit_ApprDoc.insertLinkApproval L2710-2719 · Biz01_Tab_Card.insertLinkApprovals L510-528).
 * 호출 화면의 조회 시작일(printModel.date01 = `stdDate`)로 제목 `법인카드 사용내역 보고 (yyyy.MM)`(고칠 수 있음)과
 * 본문 `yyyy년MM월 법인카드 사용내역을 보고합니다.`(원본 그대로 "년"과 월 사이 공백 없음)를 만든다. 첨부 엑셀은 문서 ID가 정해질 때 `POST biz/relate-apprs/person`이 만든다.
 */
@Component
public class CardLinkSeedProvider implements AprLinkSeedProvider {

    @Override
    public Set<String> linkCodes() {
        return Set.of("A41");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 정보가 없습니다: stdDate");
    }

    @Override
    public Seed seed(UserPrincipal user, String linkCode, Long refId, Map<String, String> args) {
        LocalDate std;
        try {
            std = LocalDate.parse(args.getOrDefault("stdDate", ""));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "기준일자 형식이 올바르지 않습니다.", e);
        }
        String title = "법인카드 사용내역 보고 (" + std.format(DateTimeFormatter.ofPattern("yyyy.MM")) + ")";
        String content = std.format(DateTimeFormatter.ofPattern("yyyy년MM월")) + " 법인카드 사용내역을 보고합니다.";
        return new Seed(title, content, null, false, false);
    }
}
