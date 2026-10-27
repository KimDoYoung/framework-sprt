package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusDetailRes;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusPrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.FundOperateStatusRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFundOperateStatusMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFundOperateStatusService {

    private final IcamFundOperateStatusMapper mapper;

    public List<FundOperateStatusRes> search(
            UserPrincipal user,
            LocalDate startDate,
            LocalDate closeDate,
            String fundType,
            String searchText
    ) {
        String searchParam = normalizeSearchText(searchText);
        String typeParam = (fundType != null && !fundType.isBlank()) ? fundType : "1";
        return mapper.selectFundBookAvg(user.getCompanyId(), startDate, closeDate, typeParam, searchParam);
    }

    public List<FundOperateStatusDetailRes> searchDetails(
            UserPrincipal user,
            LocalDate stdDate,
            String fundType,
            String searchText
    ) {
        String searchParam = normalizeSearchText(searchText);
        String typeParam = (fundType != null && !fundType.isBlank()) ? fundType : "1";
        return mapper.selectByStdDate(user.getCompanyId(), stdDate, typeParam, searchParam);
    }

    @Transactional
    public String insertRdPrint(UserPrincipal user, FundOperateStatusPrintReq req) {
        long groupId = mapper.selectNextId();
        String searchParam = normalizeSearchText(req.searchText());
        String typeParam = (req.fundType() != null && !req.fundType().isBlank()) ? req.fundType() : "1";

        mapper.deletePrint(user.getCompanyId(), user.getUserId(), "Icam06_Tab_FundOperateStatus");
        mapper.insertPrintFundOperateStatus(
                user.getCompanyId(),
                user.getUserId(),
                "Icam06_Tab_FundOperateStatus",
                groupId,
                req.startDate(),
                req.closeDate(),
                typeParam,
                searchParam
        );
        return String.valueOf(groupId);
    }

    private String normalizeSearchText(String searchText) {
        if (searchText == null || searchText.isBlank()) {
            return "%%";
        }
        return "%" + searchText.trim() + "%";
    }
}
