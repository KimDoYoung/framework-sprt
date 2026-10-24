package kr.co.kfs.asseterp.biz.tdm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.tdm.dto.HrApplyReq;
import kr.co.kfs.asseterp.biz.tdm.dto.HrChangeRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrLookupRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrNowRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRes;
import kr.co.kfs.asseterp.biz.tdm.dto.HrRowRes;
import kr.co.kfs.asseterp.biz.tdm.mapper.TdmHrMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

/** 임원(인사) 정보 (AS-IS server/tdm/Tdm01_Hr) — 임원선택 조회창(N01)과 임원 등록(N04) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TdmHrService {

    private final TdmHrMapper mapper;

    /** AS-IS Tdm01_Lookup_SelectSingle.retrieve: searchText를 %…%로 감싸 selectByEndDate */
    public List<HrLookupRes> lookup(UserPrincipal user, String searchText) {
        return mapper.selectByEndDate(user.getCompanyId(), "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Tdm01_Tab_Hr.retrieve: companyId, exceptRetireYn, searchText(%…%) → selectByCompanyId */
    public List<HrRes> search(UserPrincipal user, boolean exceptRetireYn, String searchText) {
        return mapper.selectByCompanyId(user.getCompanyId(), exceptRetireYn, "%" + (searchText == null ? "" : searchText) + "%");
    }

    /** AS-IS Tdm01_Lookup_HrChangeInfo.retrieve → selectPersonModifyed */
    public List<HrChangeRes> searchChanges(UserPrincipal user) {
        return mapper.selectPersonModifyed(user.getCompanyId());
    }

    /**
     * AS-IS Tdm01_Hr.updateHrInfo (server L42-215): 변동 목록의 행마다 현재 인사(getPerson) 상태를 읽어
     * 1 신규 = tdm01_hr INSERT + tdm02_hr_record(NEW), 2 변동 = 바뀐 항목만 문구로 모아 UPDATE + tdm02(UPD),
     * 3 제외 = 퇴사일·책무대상 종료일 UPDATE + tdm02(DEL). 그 밖의 구분은 오류.
     */
    @Transactional
    public void applyChanges(UserPrincipal user, List<HrApplyReq> rows) {
        Long companyId = user.getCompanyId();
        String updName = user.getName();
        for (HrApplyReq change : rows) {
            HrNowRes now = mapper.selectGetPersonByPersonId(companyId, change.personId());
            if (now == null) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            String type = change.changeTypeCode();
            if ("1".equals(type)) {
                mapper.insertHr(companyId, now, updName);
                mapper.insertHrRecord(companyId, "NEW", now.korName(),
                        "직위 : " + now.posName() + " / " +
                        "직책 : " + now.titleName() + " / " +
                        "조직 : " + now.orgCodeName() + " / " +
                        "입사일 : " + date(now.hireDate()), updName);
            } else if ("2".equals(type)) {
                changeHr(companyId, updName, change, now);
            } else if ("3".equals(type)) {
                mapper.updateEndDate(now.personId(), now.retireDate(), now.transDate(), updName);
                mapper.insertHrRecord(companyId, "DEL", now.korName(),
                        "책무대상자 지정 종료일 : " + date(now.transDate()), updName);
            } else {
                throw new BusinessException(ErrorCode.INVALID_INPUT,
                        "정의되지 않은 변경구분입니다. 관리자에게 문의하세요 [" + type + "]");
            }
        }
    }

    /** 변경구분 2(변동): AS-IS 순서·문구 그대로 (사원명 → 직위 → 직책 → 입사일 → 퇴사일 → 조직 → 책무대상 지정) */
    private void changeHr(Long companyId, String updName, HrApplyReq change, HrNowRes now) {
        HrRowRes hr = mapper.selectByPersonId(now.personId());
        if (hr == null) {
            throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
        }
        String personName = hr.personName();
        String posCode = hr.posCode();
        String titleCode = hr.titleCode();
        LocalDate hireDate = hr.hireDate();
        LocalDate retireDate = hr.retireDate();
        LocalDate endDate = hr.endDate();
        Long orgId = hr.orgId();
        String orgName = hr.orgName();

        StringBuilder content = new StringBuilder();

        if (!Objects.equals(personName, now.korName())) {
            content.append("사원명변경(").append(personName).append(" => ").append(now.korName()).append(")");
            personName = now.korName();
        }
        if (!Objects.equals(posCode, now.posCode())) {
            content.append("직위변경(").append(hr.posName()).append(" => ").append(now.posName()).append(")");
            posCode = now.posCode();
        }
        if (!Objects.equals(titleCode, now.titleCode())) {
            sep(content);
            content.append("직책변경(").append(hr.titleName()).append(" => ").append(now.titleName()).append(")");
            titleCode = now.titleCode();
        }
        if (!Objects.equals(hireDate, now.hireDate())) {
            sep(content);
            content.append("입사일변경(").append(date(hireDate)).append(" => ").append(date(now.hireDate())).append(")");
            hireDate = now.hireDate();
        }
        if (retireDate != null && now.retireDate() != null) {
            if (!retireDate.equals(now.retireDate())) {
                sep(content);
                content.append("퇴사일변경(").append(date(retireDate)).append(" => ").append(date(now.retireDate())).append(")");
                retireDate = now.retireDate();
            }
        } else if (retireDate == null && now.retireDate() != null) {
            sep(content);
            content.append("퇴사(퇴사일:").append(date(now.retireDate())).append(")");
            retireDate = now.retireDate();
            if (endDate == null) {
                endDate = retireDate;
            }
        } else if (retireDate != null && now.retireDate() == null) {
            sep(content);
            content.append("퇴사 취소");
            retireDate = null;
        }
        if (!Objects.equals(orgId, now.orgCodeId())) {
            sep(content);
            content.append("조직 변경(").append(orgName).append(" => ").append(now.orgCodeName()).append(")");
            orgId = now.orgCodeId();
            orgName = now.orgCodeName();
        } else if (!Objects.equals(orgName, now.orgCodeName())) {
            sep(content);
            content.append("조직명 변경(").append(orgName).append(" => ").append(now.orgCodeName()).append(")");
            orgName = now.orgCodeName();
        }
        if (change.befEndDate() != null && change.aftEndDate() == null) {
            sep(content);
            content.append("책무대상 지정");
            endDate = null;
        }

        mapper.updateHrChange(new HrRowRes(hr.personId(), personName, posCode, hr.posName(), titleCode, hr.titleName(),
                hireDate, retireDate, endDate, orgId, orgName), now.orgHeadName(), updName);
        mapper.insertHrRecord(companyId, "UPD", now.korName(), content.toString(), updName);
    }

    /** AS-IS: 앞에 문구가 있으면 " / " (사원명변경 → 직위변경 사이에는 AS-IS도 구분자가 없다) */
    private static void sep(StringBuilder content) {
        if (content.length() != 0) {
            content.append(" / ");
        }
    }

    /** AS-IS SimpleDateFormat("yyyy-MM-dd") — null은 AS-IS면 오류지만 빈 글자로 둔다 */
    private static String date(LocalDate d) {
        return d == null ? "" : d.toString();
    }
}
