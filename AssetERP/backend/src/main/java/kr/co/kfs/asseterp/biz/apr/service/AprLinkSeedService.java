package kr.co.kfs.asseterp.biz.apr.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprNewDocTypeRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprApprNewMapper;
import kr.co.kfs.asseterp.biz.apr.service.link.AprLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.AprLinkSeedProvider.Seed;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;

/**
 * 링크코드로 결재창 열기 (AS-IS Apr01_Edit_ApprDoc.insertLinkApproval L1524-2953, V17).
 * 문서 번호·결재선·연관법규/내규는 새 문서 열기(`GET apr/apprs/new`)가 만들고, 여기서는 링크코드별 제목·본문·시행일자만 돌려준다.
 * 본문이 없으면(provider가 null) 문서분류의 대표 양식을 쓴다(checkContent L4066-4090).
 */
@Service
@Transactional(readOnly = true)
public class AprLinkSeedService {

    private final AprApprNewMapper mapper;
    private final Map<String, AprLinkSeedProvider> providers = new HashMap<>();

    public AprLinkSeedService(AprApprNewMapper mapper, List<AprLinkSeedProvider> list) {
        this.mapper = mapper;
        for (AprLinkSeedProvider p : list) {
            for (String code : p.linkCodes()) {
                providers.put(code, p);
            }
        }
    }

    public AprLinkSeedRes seed(UserPrincipal user, Long classTreeId, String linkCode, Long refId) {
        return seed(user, classTreeId, linkCode, refId, Map.of());
    }

    public AprLinkSeedRes seed(UserPrincipal user, Long classTreeId, String linkCode, Long refId, Map<String, String> args) {
        AprLinkSeedProvider provider = providers.get(linkCode);
        if (provider == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "아직 지원하지 않는 링크코드입니다: " + linkCode);
        }
        Seed s = provider.seed(user, linkCode, refId, args == null ? Map.of() : args);
        String title = s.title();
        String content = s.content();
        if (content == null) {
            AprNewDocTypeRow docType = mapper.selectDefaultDocType(classTreeId, user.getCompanyId());
            if (docType != null) {
                if (title == null) {
                    title = docType.title();
                }
                content = docType.content();
            }
        }
        return new AprLinkSeedRes(linkCode, title, content, s.effectDate() != null ? s.effectDate() : mapper.selectToday(), s.titleReadOnly(), s.saveVisible(), s.receiveName(), s.referenceName(), s.inOutTypeCode(), s.relateApprs(), s.relateFunds(), s.relateAdvs());
    }
}
