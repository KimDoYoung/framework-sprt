package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.fnd.dto.IssuingEntityRes;
import kr.co.kfs.asseterp.biz.fnd.dto.IssuingEntityRow;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndIssuingEntityMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.List;

/**
 * AS-IS server/fnd/Fnd07_IssuingEntity.java (selectByCodeName L23 / delete L47) + 서블릿 IssuingEntityUpload([파일업로드]).
 * 화면의 저장이 부르는 update는 원본 서버에 없다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndIssuingEntityService {

    private static final String UPLOAD_FAIL = "파일 업로드시 오류가 발생하였습니다.";

    private final FndIssuingEntityMapper mapper;

    /** AS-IS selectByCodeName L23-39: "%발행기관명%". 회사 조건이 없다 */
    public List<IssuingEntityRes> search(String issuingEntityName) {
        return mapper.selectByCodeName("%" + (issuingEntityName == null ? "" : issuingEntityName) + "%");
    }

    /**
     * AS-IS 화면의 저장은 fnd.Fnd07_IssuingEntity.update를 부르는데 원본 서버(Fnd07_IssuingEntity.java)에 그 메서드가 없다 → 원본에서도 저장이 실패한다.
     * 03 원칙 4·5에 따라 그대로 거절하고, 동작하게 고칠지는 사용자 결정(작업기록 제안)
     */
    @Transactional
    public List<IssuingEntityRes> save(UserPrincipal user, List<IssuingEntityRes> rows) {
        throw new BusinessException(ErrorCode.INVALID_INPUT, "발행기관 저장 서비스(update)가 원본 서버에 없어 저장되지 않습니다");
    }

    /** AS-IS delete L47-50 (UpdateDataModel.deleteModel) */
    @Transactional
    public void delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        mapper.deleteIssuingEntities(user.getCompanyId(), ids);
    }

    /**
     * AS-IS IssuingEntityUpload.uploadFile L51-137: MS949 텍스트, 한 줄이 한 기관, `|` 로 나눈 칸 = 코드·이름·소속구분·액면가·결산월·국가코드.
     * 한 줄마다 selectByCodeName(칸0)으로 찾는데 이 SQL은 이름 LIKE라 코드로 찾아 거의 항상 새 행이 된다(원본 그대로). 하나라도 실패하면 전체 롤백
     */
    @Transactional
    public void upload(UserPrincipal user, MultipartFile file) {
        Long companyId = user.getCompanyId();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), Charset.forName("MS949")))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split("\\|");
                IssuingEntityRow row = null;
                for (int j = 0; j < data.length; j++) {
                    switch (j) {
                        case 0 -> row = startRow(data[0], companyId);
                        case 1 -> row = withName(row, data[1]);
                        case 2 -> row = withAttach(row, data[2]);
                        case 3 -> row = withFaceValue(row, Long.parseLong(data[3]));
                        case 4 -> row = withSettleMonth(row, data[4]);
                        case 5 -> row = withNation(row, data[5]);
                        default -> { }
                    }
                }
                mapper.insertUpdate(row);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (IOException | RuntimeException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, UPLOAD_FAIL + "(Exception)");
        }
    }

    /** case 0: 코드로 찾아 있으면 그 행을, 없으면 새 행(새 id·로그인 회사·사용 안 함) */
    private IssuingEntityRow startRow(String code, Long companyId) {
        List<IssuingEntityRes> found = mapper.selectByCodeName(code);
        if (found.size() > 1) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, UPLOAD_FAIL + " \r\n[Expected one result (or null) to be returned by selectOne(), but found: " + found.size() + "]");
        }
        if (found.isEmpty()) {
            return new IssuingEntityRow(mapper.selectNextId(), code, null, null, null, null, null, "false", null, companyId);
        }
        IssuingEntityRes e = found.get(0);
        return new IssuingEntityRow(e.issuingEntityId(), code, e.issuingEntityName(), e.issuingEntityAttachCode(), e.issuingEntityFaceValue(),
                e.issuingEntitySettleMonth(), e.issuingEntityNationCode(), e.issuingEntityUseYn(), e.issuingEntityNote(), e.companyId());
    }

    private static IssuingEntityRow withName(IssuingEntityRow r, String v) {
        return new IssuingEntityRow(r.issuingEntityId(), r.issuingEntityCode(), v, r.issuingEntityAttachCode(), r.issuingEntityFaceValue(),
                r.issuingEntitySettleMonth(), r.issuingEntityNationCode(), r.issuingEntityUseYn(), r.issuingEntityNote(), r.companyId());
    }

    private static IssuingEntityRow withAttach(IssuingEntityRow r, String v) {
        return new IssuingEntityRow(r.issuingEntityId(), r.issuingEntityCode(), r.issuingEntityName(), v, r.issuingEntityFaceValue(),
                r.issuingEntitySettleMonth(), r.issuingEntityNationCode(), r.issuingEntityUseYn(), r.issuingEntityNote(), r.companyId());
    }

    private static IssuingEntityRow withFaceValue(IssuingEntityRow r, Long v) {
        return new IssuingEntityRow(r.issuingEntityId(), r.issuingEntityCode(), r.issuingEntityName(), r.issuingEntityAttachCode(), v,
                r.issuingEntitySettleMonth(), r.issuingEntityNationCode(), r.issuingEntityUseYn(), r.issuingEntityNote(), r.companyId());
    }

    private static IssuingEntityRow withSettleMonth(IssuingEntityRow r, String v) {
        return new IssuingEntityRow(r.issuingEntityId(), r.issuingEntityCode(), r.issuingEntityName(), r.issuingEntityAttachCode(), r.issuingEntityFaceValue(),
                v, r.issuingEntityNationCode(), r.issuingEntityUseYn(), r.issuingEntityNote(), r.companyId());
    }

    private static IssuingEntityRow withNation(IssuingEntityRow r, String v) {
        return new IssuingEntityRow(r.issuingEntityId(), r.issuingEntityCode(), r.issuingEntityName(), r.issuingEntityAttachCode(), r.issuingEntityFaceValue(),
                r.issuingEntitySettleMonth(), v, r.issuingEntityUseYn(), r.issuingEntityNote(), r.companyId());
    }
}
